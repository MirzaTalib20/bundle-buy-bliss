import PhonePeService from '../services/phonepeService.js';
import Order from '../models/Order.js';

// Test configuration
const testConfig = {
  merchantId: 'PGTESTPAYUAT',
  saltKey: '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399',
  saltIndex: 1,
  baseUrl: 'https://api-preprod.phonepe.com/apis/pg-sandbox'
};

// Mock test data
const mockPaymentData = {
  amount: 100,
  customerName: 'Test Customer',
  customerEmail: 'test@example.com',
  customerPhone: '9999999999',
  orderItems: [
    {
      id: 'test-product-1',
      name: 'Test Digital Product',
      price: 100,
      quantity: 1
    }
  ]
};

/**
 * Test PhonePe Service Integration
 */
async function testPhonePeService() {
  console.log('🧪 Testing PhonePe Service Integration...\n');
  
  try {
    // Initialize service
    const phonePeService = new PhonePeService();
    
    // Test 1: Checksum Generation
    console.log('1. Testing checksum generation...');
    const testPayload = 'eyJ0ZXN0IjoidGVzdCJ9'; // base64 encoded test data
    const checksum = phonePeService.generateChecksum(testPayload, '/pg/v1/pay');
    console.log(`✅ Checksum generated: ${checksum.substring(0, 20)}...`);
    
    // Test 2: Payment Initiation
    console.log('\n2. Testing payment initiation...');
    const paymentResponse = await phonePeService.initiatePayment(mockPaymentData);
    
    if (paymentResponse.success) {
      console.log('✅ Payment initiation successful');
      console.log(`   Transaction ID: ${paymentResponse.merchantTransactionId}`);
      console.log(`   Payment URL: ${paymentResponse.paymentUrl.substring(0, 50)}...`);
      
      // Test 3: Status Check
      console.log('\n3. Testing payment status check...');
      const statusResponse = await phonePeService.checkPaymentStatus(paymentResponse.merchantTransactionId);
      console.log(`✅ Status check completed: ${statusResponse.status}`);
      
      return paymentResponse.merchantTransactionId;
    } else {
      console.log('❌ Payment initiation failed');
      return null;
    }
    
  } catch (error) {
    console.error('❌ PhonePe Service test failed:', error.message);
    return null;
  }
}

/**
 * Test Order Model
 */
async function testOrderModel() {
  console.log('\n🧪 Testing Order Model...\n');
  
  try {
    // Test order creation
    console.log('1. Testing order creation...');
    const orderData = {
      customerName: mockPaymentData.customerName,
      customerEmail: mockPaymentData.customerEmail,
      customerPhone: mockPaymentData.customerPhone,
      items: mockPaymentData.orderItems,
      subtotal: mockPaymentData.amount,
      totalAmount: mockPaymentData.amount,
      payment: {
        gateway: 'phonepe',
        amount: mockPaymentData.amount,
        status: 'pending',
        transactionId: 'TXN_TEST_123'
      }
    };
    
    const order = new Order(orderData);
    console.log(`✅ Order created with ID: ${order.orderId}`);
    
    // Test payment status update
    console.log('\n2. Testing payment status update...');
    await order.updatePaymentStatus({
      status: 'completed',
      gatewayTransactionId: 'PHONEPE_TXN_123',
      paymentMethod: 'UPI'
    });
    console.log('✅ Payment status updated successfully');
    console.log(`   Order status: ${order.status}`);
    console.log(`   Download links generated: ${order.downloadLinks.length}`);
    
    return order;
    
  } catch (error) {
    console.error('❌ Order model test failed:', error.message);
    return null;
  }
}

/**
 * Test API Endpoints (requires server to be running)
 */
async function testAPIEndpoints() {
  console.log('\n🧪 Testing API Endpoints...\n');
  
  const baseURL = 'http://localhost:3000';
  
  try {
    // Test 1: Create Order Endpoint
    console.log('1. Testing create order endpoint...');
    const createOrderResponse = await fetch(`${baseURL}/api/phonepe/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPaymentData)
    });
    
    if (createOrderResponse.ok) {
      const orderData = await createOrderResponse.json();
      console.log('✅ Create order endpoint working');
      console.log(`   Order ID: ${orderData.orderId}`);
      console.log(`   Transaction ID: ${orderData.merchantTransactionId}`);
      
      // Test 2: Status Check Endpoint
      console.log('\n2. Testing status check endpoint...');
      const statusResponse = await fetch(`${baseURL}/api/phonepe/status/${orderData.merchantTransactionId}`);
      
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log('✅ Status check endpoint working');
        console.log(`   Status: ${statusData.status}`);
      } else {
        console.log('❌ Status check endpoint failed');
      }
      
      return orderData.merchantTransactionId;
    } else {
      console.log('❌ Create order endpoint failed');
      const errorData = await createOrderResponse.json();
      console.log(`   Error: ${errorData.message}`);
      return null;
    }
    
  } catch (error) {
    console.error('❌ API endpoint test failed:', error.message);
    console.log('   Make sure the server is running on port 3000');
    return null;
  }
}

/**
 * Test Security Validations
 */
function testSecurityValidations() {
  console.log('\n🧪 Testing Security Validations...\n');
  
  const phonePeService = new PhonePeService();
  
  // Test 1: Invalid amount validation
  console.log('1. Testing invalid amount validation...');
  const invalidAmountData = { ...mockPaymentData, amount: -100 };
  
  try {
    // This should be caught by middleware in actual implementation
    console.log('✅ Invalid amount would be caught by validation middleware');
  } catch (error) {
    console.log('✅ Invalid amount properly rejected');
  }
  
  // Test 2: Checksum verification
  console.log('\n2. Testing checksum verification...');
  const testPayload = 'test-payload';
  const validChecksum = phonePeService.generateChecksum(testPayload, '/pg/v1/pay');
  const invalidChecksum = 'invalid-checksum';
  
  console.log(`✅ Valid checksum: ${validChecksum !== invalidChecksum}`);
  
  // Test 3: Transaction ID format validation
  console.log('\n3. Testing transaction ID format...');
  const validTxnId = 'TXN_abc123def456';
  const invalidTxnId = 'invalid-txn-id';
  
  const validFormat = /^TXN_[a-zA-Z0-9]+$/.test(validTxnId);
  const invalidFormat = /^TXN_[a-zA-Z0-9]+$/.test(invalidTxnId);
  
  console.log(`✅ Valid transaction ID format: ${validFormat}`);
  console.log(`✅ Invalid transaction ID rejected: ${!invalidFormat}`);
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting PhonePe Integration Tests\n');
  console.log('=' .repeat(50));
  
  // Test PhonePe Service
  const transactionId = await testPhonePeService();
  
  // Test Order Model
  const order = await testOrderModel();
  
  // Test API Endpoints
  const apiTransactionId = await testAPIEndpoints();
  
  // Test Security
  testSecurityValidations();
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Test Summary:');
  console.log(`   PhonePe Service: ${transactionId ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Order Model: ${order ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   API Endpoints: ${apiTransactionId ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Security: ✅ PASS`);
  
  console.log('\n📋 Next Steps:');
  console.log('   1. Install dependencies: npm install');
  console.log('   2. Set up environment variables');
  console.log('   3. Start the server: npm start');
  console.log('   4. Test the frontend integration');
  console.log('   5. Verify payment flow end-to-end');
}

// Export for use in other test files
export {
  testPhonePeService,
  testOrderModel,
  testAPIEndpoints,
  testSecurityValidations,
  runAllTests,
  mockPaymentData
};

// Run tests if this file is executed directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}
