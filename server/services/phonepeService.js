import crypto from "crypto";
import axios from "axios";

class PhonePeAPIService {
  constructor() {
    this.validateConfig();

    this.merchantId = process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT86";
    this.saltKey =
      process.env.PHONEPE_SALT_KEY || "96434309-7796-489d-8924-ab56988a6076";
    this.saltIndex = process.env.PHONEPE_SALT_INDEX || "1";
    this.clientId = process.env.PHONEPE_CLIENT_ID || "test-client-id";
    this.clientSecret =
      process.env.PHONEPE_CLIENT_SECRET || "test-client-secret";
    this.clientVersion =
      process.env.PHONEPE_CLIENT_VERSION || "test-client-version";
    this.appBaseUrl = process.env.APP_BASE_URL;

    const isProd = process.env.NODE_ENV === "production";
    this.baseUrls = {
      auth: isProd
        ? "https://api.phonepe.com/apis/identity-manager"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox",
      payment: isProd
        ? "https://api.phonepe.com/apis/pg"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox",
    };

    this.accessToken = null;
    this.tokenExpiry = null;

    console.log(
      `📡 PhonePe Service initialized in ${isProd ? "Production" : "Sandbox"}`
    );
  }

  validateConfig() {
    const required = ["APP_BASE_URL"];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }
  }

  /** ------------------------
   * 🔑 Authentication
   * ----------------------- */
  async getAccessToken() {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const res = await axios.post(
        `${this.baseUrls.auth}/v1/oauth/token`,
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: this.clientId,
          client_secret: this.clientSecret,
          client_version: this.clientVersion,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            accept: "application/json",
          },
        }
      );

      if (!res.data.access_token) {
        throw new Error("No access_token in response");
      }

      this.accessToken = res.data.access_token;
      this.tokenExpiry = Date.now() + (res.data.expires_in - 300) * 1000;

      console.log("🔑 OAuth token refreshed");
      return this.accessToken;
    } catch (err) {
      console.error("OAuth error:", err.response?.data || err.message);

      if (process.env.NODE_ENV !== "production") {
        console.log("⚠️ Sandbox mode: continuing without token");
        return null;
      }

      throw err;
    }
  }

  /** ------------------------
   * 🧾 Utilities
   * ----------------------- */
  generateTransactionId(prefix = "TXN") {
    return `${prefix}_${Date.now()}_${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;
  }

  createChecksum(data, endpoint) {
    const sha256 = crypto
      .createHash("sha256")
      .update(data + endpoint + this.saltKey)
      .digest("hex");
    return `${sha256}###${this.saltIndex}`;
  }

  createPaymentChecksum(payload) {
    const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    const checksum = this.createChecksum(base64, "/checkout/v2/pay");
    return { payloadBase64: base64, checksum };
  }

  createStatusChecksum(txnId) {
    return this.createChecksum("", `/checkout/v2/order/${txnId}/status`);
  }

  getErrorMessage(err) {
    return (
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Unexpected error"
    );
  }

  /** ------------------------
   * 💳 Payment Flow
   * ----------------------- */
  async initiatePayment({ amount, customerPhone, customerName, customerEmail }) {
    try {
      this.validatePaymentData({ amount, customerPhone, customerName });
console.log("Initiating payment:", { amount, customerPhone, customerName, customerEmail });
      const merchantTransactionId = this.generateTransactionId("BBB");
      const merchantOrderId = `ORDER_${merchantTransactionId}`;

      const payload = {
        merchantId: this.merchantId,
        merchantTransactionId,
        merchantOrderId,
        merchantUserId: customerPhone || "GUEST",
        amount: Math.round(amount * 100),
        redirectUrl: `${this.appBaseUrl}/api/phonepe/callback/${merchantTransactionId}`,
        callbackUrl: `${this.appBaseUrl}/api/phonepe/callback/${merchantTransactionId}`,
        paymentInstrument: { type: "PAY_CHECKOUT" },
        metaInfo: {
          udf1: customerName || "NA",
          udf2: customerEmail || "NA",
          udf3: customerPhone || "NA",
        },
      };

      const { payloadBase64, checksum } = this.createPaymentChecksum(payload);

      const headers = {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": this.merchantId,
        accept: "application/json",
      };

      const token = await this.getAccessToken();
      if (token) headers["Authorization"] = `O-Bearer ${token}`;

      const res = await axios.post(
        `${this.baseUrls.payment}/checkout/v2/pay`,
        { request: payloadBase64 },
        { headers, timeout: 30000 }
      );

      if (res.status === 200 && res.data?.redirectUrl) {
        return {
          success: true,
          paymentUrl: res.data.redirectUrl,
          merchantTransactionId,
          merchantOrderId,
          state: res.data.state,
        };
      }

      throw new Error(this.getErrorMessage(res));
    } catch (err) {
      return { success: false, error: this.getErrorMessage(err) };
    }
  }

async initiatePayment(paymentData) {
  try {
    const { amount, customerPhone, customerName, customerEmail, orderId = null } = paymentData;

    // Validate required fields
    this.validatePaymentData({ amount, customerPhone, customerName });

    const merchantTransactionId = orderId || this.generateTransactionId('BBB');
    const merchantOrderId = `ORDER_${merchantTransactionId}`;

    console.log('🚀 Initiating PhonePe payment v2:', {
      merchantTransactionId,
      merchantOrderId,
      amount,
      customer: customerName,
      baseUrl: this.baseUrls,
    });

    // Payment payload (matches PhonePe docs)
    const paymentPayload = {
      merchantTransactionId,
      merchantOrderId,
      merchantId: this.merchantId,
      amount: Math.round(amount * 100), // paise
      expireAfter: 1200, // 20 mins expiry
      metaInfo: {
        udf1: customerName || "NA",
        udf2: customerEmail || "NA",
        udf3: customerPhone || "NA",
        udf4: "bundle-buy-bliss",
        udf5: merchantTransactionId,
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Redirecting to PhonePe",
        merchantUrls: {
          redirectUrl: `${this.appBaseUrl}/api/phonepe/callback/${merchantTransactionId}`, // ✅
        },
      },
    };

    console.log('📋 Payment payload v2:', JSON.stringify(paymentPayload, null, 2));

    // Ensure OAuth token
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      throw new Error('Access token required for PhonePe v2 payment');
    }

    // Request headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `O-Bearer ${accessToken}`,
    };

    console.log('baase url', this.baseUrls);
    // API Request
    const apiResponse = await axios.post(
      `${this.baseUrls.payment}/checkout/v2/pay`,
      paymentPayload,
      { headers, timeout: 30000 }
    );

    console.log('📨 Full API Response:', JSON.stringify(apiResponse.data, null, 2));

     if (apiResponse.status === 200 && apiResponse.data?.redirectUrl) {
        return {
          success: true,
          paymentUrl: apiResponse.data.redirectUrl,
          merchantTransactionId,
          merchantOrderId,
          state: apiResponse.data.state,
        };
      }

    throw new Error(apiResponse.data?.message || 'Unexpected API response');

  } catch (error) {
    console.error('💥 Payment initiation failed:', error.message);
    return {
      success: false,
      error: this.getErrorMessage(error),
      debug: {
        responseData: error.response?.data,
        statusCode: error.response?.status,
      },
    };
  }
}

  // Check payment status using PhonePe API v2
async checkPaymentStatus(merchantTransactionId) {
  try {
    if (!merchantTransactionId) {
      throw new Error('Transaction ID is required');
    }

    console.log('Checking payment status with O-Bearer:', merchantTransactionId);

    // Ensure we have a valid access token
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      throw new Error('Access token is required for status API');
    }

    // Headers (OAuth only, no checksum)
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `O-Bearer ${accessToken}`,
    };

    // API URL
    const apiUrl = `${this.paymentBaseUrl}/checkout/v2/order/${merchantTransactionId}/status`;

    // Make status check request
    const apiResponse = await axios.get(apiUrl, {
      headers,
      timeout: 15000
    });

    console.log('📨 Status API Response:', JSON.stringify(apiResponse.data, null, 2));

    if (apiResponse.data.success && apiResponse.data.data) {
      const paymentInfo = apiResponse.data.data;

      return {
        success: true,
        status: paymentInfo.state,  // COMPLETED, FAILED, PENDING
        responseCode: paymentInfo.responseCode,
        merchantTransactionId: paymentInfo.merchantTransactionId,
        transactionId: paymentInfo.transactionId,
        amount: paymentInfo.amount,
        paymentInstrument: paymentInfo.paymentInstrument,
        message: this.getStatusMessage(paymentInfo.state),
      };
    } else {
      throw new Error(apiResponse.data.message || 'Failed to get payment status');
    }
  } catch (error) {
    console.error('Status check failed:', {
      merchantTransactionId,
      error: error.message,
      response: error.response?.data,
    });

    return {
      success: false,
      status: 'ERROR',
      error: this.getErrorMessage(error),
      merchantTransactionId,
    };
  }
}

  /** ------------------------
   * 📞 Callback Handling
   * ----------------------- */
  async verifyCallback({ response, checksum }) {
    if (!response || !checksum) {
      return { isValid: false, error: "Missing response/checksum" };
    }

    const expected =
      crypto
        .createHash("sha256")
        .update(response + this.saltKey)
        .digest("hex") +
      "###" +
      this.saltIndex;

    if (checksum !== expected) {
      return { isValid: false, error: "Checksum mismatch" };
    }

    const decoded = JSON.parse(
      Buffer.from(response, "base64").toString("utf8")
    );
    return { isValid: true, data: decoded };
  }

  async handleCallback(req, res) {
    try {
      const verification = await this.verifyCallback(req.body);
      if (!verification.isValid) {
        return res.status(400).json({ success: false, message: "Invalid" });
      }

      const status = await this.checkPaymentStatus(
        verification.data.merchantTransactionId
      );
      if (!status.success) {
        return res.status(500).json({ success: false, message: status.error });
      }

      await this.processPaymentResult(status);
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /** ------------------------
   * 🏗️ Extension Hooks
   * ----------------------- */
  async processPaymentResult(result) {
    switch (result.state) {
      case "COMPLETED":
        return this.onPaymentSuccess(result);
      case "FAILED":
        return this.onPaymentFailure(result);
      case "PENDING":
        return this.onPaymentPending(result);
      default:
        console.log("⚠️ Unknown state:", result.state);
    }
  }

  async onPaymentSuccess(data) {
    console.log("✅ Payment success:", data.merchantTransactionId);
  }
  async onPaymentFailure(data) {
    console.log("❌ Payment failed:", data.merchantTransactionId);
  }
  async onPaymentPending(data) {
    console.log("⏳ Payment pending:", data.merchantTransactionId);
  }

  validatePaymentData({ amount, customerPhone, customerName }) {
    if (!amount || amount <= 0) throw new Error("Invalid amount");
    if (!customerPhone || customerPhone.length < 10)
      throw new Error("Invalid phone");
    if (!customerName?.trim()) throw new Error("Customer name required");
  }
}

export default PhonePeAPIService;
