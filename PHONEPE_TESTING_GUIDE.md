# PhonePe Payment Gateway Testing Guide

## Overview
This guide provides comprehensive testing procedures for the PhonePe payment gateway integration in the Bundle Buy Bliss application.

## Prerequisites

### 1. Environment Setup
```bash
# Install dependencies
cd bundle-buy-bliss/server
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 2. Required Environment Variables
```env
# PhonePe UAT Configuration
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_SALT_INDEX=1

# Application URLs
APP_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:8080

# Database
MONGODB_URI=your-mongodb-connection-string
```

## Testing Phases

### Phase 1: Unit Testing

#### Backend Service Testing
```bash
# Run PhonePe service tests
cd bundle-buy-bliss/server
node tests/phonepe.test.js
```

**Expected Results:**
- ✅ Checksum generation working
- ✅ Payment initiation successful
- ✅ Status check functional
- ✅ Order model operations

#### Security Testing
- Rate limiting validation
- Input sanitization
- Transaction ID format validation
- Signature verification

### Phase 2: Integration Testing

#### API Endpoint Testing
1. **Create Order Endpoint**
   ```bash
   curl -X POST http://localhost:3000/api/phonepe/create-order \
   -H "Content-Type: application/json" \
   -d '{
     "customerName": "Test User",
     "customerEmail": "test@example.com",
     "customerPhone": "9999999999",
     "orderItems": [
       {
         "id": "test-1",
         "name": "Test Product",
         "price": 100,
         "quantity": 1
       }
     ],
     "totalAmount": 100
   }'
   ```

2. **Status Check Endpoint**
   ```bash
   curl http://localhost:3000/api/phonepe/status/TXN_YOUR_TRANSACTION_ID
   ```

### Phase 3: End-to-End Testing

#### Frontend Integration Testing
1. Start both servers:
   ```bash
   # Terminal 1 - Backend
   cd bundle-buy-bliss/server
   npm start

   # Terminal 2 - Frontend
   cd bundle-buy-bliss
   npm run dev
   ```

2. Navigate to `http://localhost:8080`
3. Add products to cart
4. Proceed to checkout
5. Fill customer details
6. Click "Complete Purchase"

#### Payment Flow Validation
1. **Payment Initiation**
   - ✅ Redirects to PhonePe payment page
   - ✅ Correct amount displayed
   - ✅ Merchant details visible

2. **Payment Processing**
   - ✅ Test card details accepted
   - ✅ OTP verification works
   - ✅ Payment confirmation received

3. **Callback Handling**
   - ✅ Redirects to success/failure page
   - ✅ Order status updated in database
   - ✅ Email confirmation sent

## Test Scenarios

### Scenario 1: Successful Payment
**Test Data:**
- Card: 4242424242424242
- Expiry: 12/44
- CVV: 936
- OTP: 123456

**Expected Flow:**
1. Payment initiation → Success
2. PhonePe redirect → Success
3. Payment completion → Success
4. Callback processing → Success
5. Order status → Completed
6. Email sent → Success

### Scenario 2: Failed Payment
**Test Data:**
- Use invalid card details or cancel payment

**Expected Flow:**
1. Payment initiation → Success
2. PhonePe redirect → Success
3. Payment failure → Expected
4. Callback processing → Success
5. Order status → Failed
6. User redirected to failure page

### Scenario 3: Network Issues
**Test Cases:**
- Timeout during payment
- Network interruption
- Server unavailability

### Scenario 4: Security Testing
**Test Cases:**
- Invalid transaction IDs
- Tampered checksums
- Rate limiting
- SQL injection attempts
- XSS attempts

## Validation Checklist

### ✅ Backend Validation
- [ ] PhonePe service initialization
- [ ] Checksum generation accuracy
- [ ] Payment payload creation
- [ ] Status check functionality
- [ ] Order model operations
- [ ] Database connections
- [ ] Email service integration
- [ ] Error handling
- [ ] Security middleware
- [ ] Rate limiting

### ✅ Frontend Validation
- [ ] Cart functionality
- [ ] Form validation
- [ ] Payment initiation
- [ ] Loading states
- [ ] Error handling
- [ ] Success page display
- [ ] Failure page display
- [ ] Responsive design
- [ ] Browser compatibility

### ✅ Integration Validation
- [ ] End-to-end payment flow
- [ ] Callback URL handling
- [ ] Webhook processing
- [ ] Order status updates
- [ ] Email notifications
- [ ] Download link generation
- [ ] Error recovery
- [ ] Transaction logging

### ✅ Security Validation
- [ ] HTTPS enforcement
- [ ] Input sanitization
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Signature verification
- [ ] Data encryption
- [ ] Secure headers
- [ ] Access controls

## Common Issues & Solutions

### Issue 1: Payment Initiation Fails
**Symptoms:** Error during order creation
**Solutions:**
- Check environment variables
- Verify merchant credentials
- Validate request payload
- Check network connectivity

### Issue 2: Callback Not Received
**Symptoms:** Payment completes but order status not updated
**Solutions:**
- Verify callback URL accessibility
- Check firewall settings
- Validate webhook signature
- Review server logs

### Issue 3: Amount Mismatch
**Symptoms:** Different amounts in frontend vs backend
**Solutions:**
- Validate cart calculations
- Check currency conversion
- Verify decimal handling
- Review rounding logic

## Performance Testing

### Load Testing
- Concurrent payment requests
- Database performance under load
- API response times
- Memory usage monitoring

### Stress Testing
- Maximum transaction volume
- Error rate under stress
- Recovery time
- Resource utilization

## Monitoring & Logging

### Key Metrics
- Payment success rate
- Average response time
- Error frequency
- User drop-off points

### Log Analysis
- Payment attempt logs
- Error logs
- Performance logs
- Security logs

## Production Readiness

### Pre-Production Checklist
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Monitoring setup
- [ ] Backup procedures
- [ ] Rollback plan
- [ ] Documentation complete
- [ ] Team training completed

### Go-Live Checklist
- [ ] Production credentials configured
- [ ] SSL certificates installed
- [ ] DNS configured
- [ ] Monitoring active
- [ ] Support team ready
- [ ] Rollback plan tested

## Support & Troubleshooting

### Debug Mode
Enable detailed logging by setting:
```env
NODE_ENV=development
DEBUG=phonepe:*
```

### Log Locations
- Application logs: `/var/log/app/`
- Payment logs: `/var/log/payments/`
- Error logs: `/var/log/errors/`

### Contact Information
- PhonePe Support: [PhonePe Developer Portal](https://developer.phonepe.com)
- Internal Support: Check project documentation
