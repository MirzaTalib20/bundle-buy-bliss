import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import EmailService from '../services/emailService.js';
import PhonePeAPIService from '../services/phonepeService.js'; // Updated import
import Order from '../models/Order.js';
import uniqid from 'uniqid';
import {
  paymentRateLimit,
  statusCheckRateLimit,
  validatePaymentRequest,
  sanitizeInput,
  validateTransactionId,
  securityHeaders,
  logPaymentAttempt,
  validateWebhookSignature
} from '../middleware/security.js';

dotenv.config();

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Initialize services
const phonePeService = new PhonePeAPIService(); // Updated to use API service
const emailService = new EmailService();

// MongoDB connection
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return; // already connected

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw new Error('Database connection failed');
  }
};

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  detailDescription: String,
  image: String,
  category: String,
  popular: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  features: [String],
  url: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'products'
});

const Product = mongoose.model('Product', productSchema);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Bundle Buy Bliss API is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'API endpoint working!',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      res.json({ message: 'Login successful', user: { username } });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/status', (req, res) => {
  const { username, password } = req.headers;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    res.json({ authenticated: true, user: { username } });
  } else {
    res.json({ authenticated: false });
  }
});

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    await connectToDatabase();
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/products/public', async (req, res) => {
  try {
    await connectToDatabase();
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Public get products error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    await connectToDatabase();
    const product = new Product({ ...req.body, updatedAt: new Date() });
    console.log(product)
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Contact form route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, number, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const googleScriptUrl = process.env.GOOGLE_SHEETS_URL;

    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, number: number || '', message })
    });

    if (response.ok) {
      res.json({ message: 'Contact form submitted successfully', timestamp: new Date().toISOString() });
    } else {
      console.error('Google Apps Script error:', await response.text());
      res.status(500).json({ message: 'Failed to submit form' });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Order completion route
app.post('/api/complete-order', async (req, res) => {
  try {
    const { customerName, customerEmail, orderItems, totalAmount, paymentId, orderId } = req.body;

    const googleScriptUrl = process.env.GOOGLE_SHEETS_URL;
    const orderData = {
      timestamp: new Date().toISOString(),
      customerName,
      customerEmail,
      orderItems: JSON.stringify(orderItems),
      totalAmount,
      paymentId,
      orderId,
      status: 'completed'
    };

    await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    await sendProductEmail(customerName, customerEmail, orderItems, orderId);

    res.json({ success: true, message: 'Order completed and products sent via email' });
  } catch (error) {
    console.error('Order completion error:', error);
    res.status(500).json({ success: false, message: 'Failed to complete order' });
  }
});

// Email sending function
async function sendProductEmail(customerName, customerEmail, orderItems, orderId) {
  const driveLinks = {
    'product-1': 'https://drive.google.com/file/d/YOUR_FILE_ID_1/view?usp=sharing',
    'product-2': 'https://drive.google.com/file/d/YOUR_FILE_ID_2/view?usp=sharing'
  };

  const productList = orderItems.map(item => `
    <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
      <h3>${item.name}</h3>
      <p>Price: ₹${item.price}</p>
      <p>Quantity: ${item.quantity}</p>
      ${driveLinks[item.id]
      ? `<a href="${driveLinks[item.id]}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download</a>`
      : '<p style="color: orange;">Download link will be sent separately</p>'
    }
    </div>
  `).join('');

  const emailHTML = `
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Thank you, ${customerName}!</h2>
      <p>Your order #${orderId} has been processed. Total: ₹${totalAmount}</p>
      <h3>Your Products:</h3>
      ${productList}
      <p>Contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a> if you need support.</p>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: `Your Digital Products - Order #${orderId}`,
    html: emailHTML
  };

  await transporter.sendMail(mailOptions);
}

// PhonePe Payment Routes - Updated for API Integration

// Create order and initiate PhonePe payment
app.post(
  '/api/phonepe/create-order',
  paymentRateLimit,
  sanitizeInput,
  validatePaymentRequest,
  logPaymentAttempt,
  async (req, res) => {
    try {
      await connectToDatabase();

      const { customerName, customerEmail, customerPhone, orderItems, totalAmount } = req.body;

      // Validate required fields
      if (!customerName || !customerEmail || !customerPhone || !Array.isArray(orderItems) || orderItems.length === 0 || !totalAmount) {
        return res.status(400).json({
          success: false,
          message: 'Missing or invalid required fields. Phone number is required for PhonePe.',
        });
      }

      // Map cart items to order schema
      const mappedItems = orderItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const merchantTransactionId = `BBB_${Date.now()}_${uniqid()}`;
const merchantOrderId = `ORDER_${merchantTransactionId}`;  
      // Create a new order in the database (initially pending)
      console.log('📋 Creating order with transaction ID:', merchantTransactionId);
      const order = new Order({
        customerName,
        customerEmail,
        customerPhone,
        items: mappedItems,
        subtotal: totalAmount,
        totalAmount,
        payment: {
          transactionId: merchantTransactionId,
          gateway: 'phonepe',
          amount: totalAmount,
          status: 'pending',
        },
      });

      await order.save();
      console.log('📋 Order created:', order._id);

      // Initiate payment using PhonePe API
      const paymentResponse = await phonePeService.initiatePayment({
        amount: totalAmount,
        customerPhone,
        customerName,
        customerEmail,
        orderId: merchantTransactionId,
      });

      console.log('💳 Payment response:', paymentResponse);

      if (paymentResponse.success && paymentResponse.paymentUrl) {
        // Update order with payment URL
        order.payment.transactionId = paymentResponse.merchantTransactionId;
        order.payment.paymentUrl = paymentResponse.paymentUrl;
        await order.save();

        return res.status(200).json({
          success: true,
          orderId: order._id,
          paymentUrl: paymentResponse.paymentUrl,
          merchantTransactionId: paymentResponse.merchantTransactionId,
        });
      } else {
        console.error('❌ Payment initiation failed:', paymentResponse);
        
        // Update order status to failed
        order.payment.status = 'failed';
        order.payment.failureReason = paymentResponse.error || 'Payment initiation failed';
        await order.save();

        return res.status(502).json({
          success: false,
          message: paymentResponse.error || 'Failed to initiate payment with PhonePe',
        });
      }
    } catch (error) {
      console.error('❌ Create order error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// PhonePe payment callback handler - Updated for API
app.get(
  '/api/phonepe/callback/:merchantTransactionId',
  validateTransactionId,
  async (req, res) => {
    try {
      await connectToDatabase();

      const { merchantTransactionId } = req.params;
      console.log('📞 PhonePe callback received:', merchantTransactionId);

      // --- Fetch order ---
      const order = await Order.findOne({ 'payment.transactionId': merchantTransactionId });
      if (!order) {
        console.error('❌ Order not found for transaction ID:', merchantTransactionId);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment-error?error=order-not-found`);
      }
      console.log('📋 Order found:', order._id);

      // --- Check payment status (Promise wrapper for clarity) ---
      const statusResponse = await new Promise(async (resolve) => {
        try {
          const response = await phonePeService.checkPaymentStatus(merchantTransactionId);
          resolve(response);
        } catch (err) {
          console.error('❌ Error checking payment status:', err);
          resolve({ success: false, error: err.message });
        }
      });

      console.log('📊 Payment status response:', statusResponse);

      if (!statusResponse.success) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment-error?error=status-check-failed`);
      }

      // --- Helper: update order status ---
      const updateOrderStatus = async (updates) => {
        if (typeof order.updatePaymentStatus === 'function') {
          await order.updatePaymentStatus(updates);
        } else {
          Object.assign(order.payment, updates);
          await order.save();
        }
      };

      // --- Handle statuses ---
      switch (statusResponse.status) {
        case 'COMPLETED': {
          console.log('✅ Payment successful, updating order');
          await updateOrderStatus({
            status: 'completed',
            gatewayTransactionId: statusResponse.transactionId,
            paymentMethod: statusResponse.paymentInstrument?.type || 'UPI',
            paidAt: new Date(),
          });

          // Email confirmation
          try {
            console.log('📧 Sending confirmation email to:', order.customerEmail);
            await emailService.sendOrderConfirmationEmail(
              order.customerEmail,
              order.customerName,
              order._id.toString(),
              order.totalAmount,
              order.items
            );
            console.log('✅ Email sent');
          } catch (emailError) {
            console.error('❌ Email failed:', emailError);
          }

          const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/?payment=success&orderId=${order._id}&transactionId=${merchantTransactionId}`;
          console.log('➡️ Redirecting to success:', successUrl);
          return res.redirect(successUrl);
        }

        case 'FAILED': {
          console.log('❌ Payment failed');
          await updateOrderStatus({
            status: 'failed',
            failureReason: statusResponse.error || 'Payment failed',
          });

          const failureUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment-failed?orderId=${order._id}&reason=payment-failed`;
          console.log('➡️ Redirecting to failure:', failureUrl);
          return res.redirect(failureUrl);
        }

        default: {
          console.log('⏳ Payment pending/unknown:', statusResponse.status);
          const pendingUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment-pending?orderId=${order._id}&transactionId=${merchantTransactionId}`;
          console.log('➡️ Redirecting to pending:', pendingUrl);
          return res.redirect(pendingUrl);
        }
      }
    } catch (error) {
      console.error('❌ Payment callback error:', error);
      if (!res.headersSent) {
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment-error?error=callback-failed`);
      }
    }
  }
);


// PhonePe webhook handler - Updated for API
app.post('/api/phonepe/webhook',
  validateWebhookSignature,
  async (req, res) => {
    try {
      await connectToDatabase();

      console.log('🔗 PhonePe webhook received:', req.body);

      // Verify webhook using API service
      const verification = await phonePeService.verifyCallback(req.body);

      if (!verification.isValid) {
        console.error('❌ Webhook verification failed:', verification.error);
        return res.status(400).json({ success: false, message: 'Invalid webhook' });
      }

      const webhookData = verification.data;
      const merchantTransactionId = webhookData.merchantTransactionId;

      console.log('✅ Webhook verified for transaction:', merchantTransactionId);

      // Find and update order
      const order = await Order.findOne({
        'payment.transactionId': merchantTransactionId
      });

      if (order && webhookData.state === 'COMPLETED') {
        console.log('💰 Processing successful payment from webhook');
        
        if (order.updatePaymentStatus) {
          await order.updatePaymentStatus({
            status: 'completed',
            gatewayTransactionId: webhookData.transactionId,
            paymentMethod: webhookData.paymentInstrument?.type || 'UPI',
            paidAt: new Date()
          });
        } else {
          order.payment.status = 'completed';
          order.payment.gatewayTransactionId = webhookData.transactionId;
          order.payment.paymentMethod = webhookData.paymentInstrument?.type || 'UPI';
          order.payment.paidAt = new Date();
          await order.save();
        }
      }

      res.json({ success: true });

    } catch (error) {
      console.error('❌ Webhook error:', error);
      res.status(500).json({ success: false, message: 'Webhook processing failed' });
    }
  });

// Check payment status - Updated for API
app.get('/api/phonepe/status/:merchantTransactionId',
  statusCheckRateLimit,
  validateTransactionId,
  async (req, res) => {
    try {
      const { merchantTransactionId } = req.params;
      console.log('🔍 Checking status for:', merchantTransactionId);
      
      const statusResponse = await phonePeService.checkPaymentStatus(merchantTransactionId);
      
      res.json(statusResponse);
    } catch (error) {
      console.error('❌ Status check error:', error);
      res.status(500).json({
        success: false,
        message: 'Status check failed',
        error: error.message
      });
    }
  });

// Generic Payment Routes (kept for compatibility)
app.post('/api/payment/initiate', async (req, res) => {
  try {
    const { amount, customerPhone, customerName, customerEmail, items } = req.body;

    console.log('📊 Generic payment initiation:', { amount, customerName });

    const payment = await phonePeService.initiatePayment({
      amount,
      customerPhone,
      customerName,
      customerEmail
    });

    if (payment.success) {
      res.json(payment);
    } else {
      res.status(400).json(payment);
    }
  } catch (error) {
    console.error('❌ Payment route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/payment/callback', async (req, res) => {
  try {
    console.log('📞 Generic callback received');
    
    const verification = await phonePeService.verifyCallback(req.body);
    
    if (!verification.isValid) {
      throw new Error('Invalid callback signature');
    }

    const { merchantTransactionId } = verification.data;
    const status = await phonePeService.checkPaymentStatus(merchantTransactionId);

    // Redirect based on status
    const redirectUrl = status.status === 'COMPLETED'
        ? '/payment-success'
        : '/payment-failed';

    res.redirect(`${process.env.APP_BASE_URL}${redirectUrl}`);
  } catch (error) {
    console.error('❌ Callback route error:', error);
    res.redirect(`${process.env.APP_BASE_URL}/payment-failed`);
  }
});

app.get('/api/payment/status/:merchantTransactionId', async (req, res) => {
  try {
    const status = await phonePeService.checkPaymentStatus(
      req.params.merchantTransactionId
    );
    res.json(status);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      phonepe: 'initialized'
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📱 PhonePe Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;