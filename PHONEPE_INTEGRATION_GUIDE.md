# PhonePe Payment Gateway Integration Guide

## Overview
This document provides a comprehensive guide for integrating PhonePe's payment gateway into the Bundle Buy Bliss e-commerce platform. The integration supports UPI-based payments with secure transaction processing and real-time status updates.

## Architecture Overview

### System Components
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Express Backend │    │  PhonePe Gateway │
│                 │    │                 │    │                 │
│ - Cart Management│    │ - Order Creation│    │ - Payment       │
│ - Payment UI    │    │ - Status Check  │    │   Processing    │
│ - Success/Fail  │    │ - Webhooks      │    │ - Callbacks     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MongoDB       │
                    │                 │
                    │ - Orders        │
                    │ - Products      │
                    │ - Transactions  │
                    └─────────────────┘
```

## Integration Features

### ✅ Implemented Features
- **Payment Initiation**: Secure order creation and payment URL generation
- **UPI Support**: Full UPI payment method support
- **Real-time Callbacks**: Instant payment status updates
- **Order Management**: Complete order lifecycle management
- **Security**: SHA256 signature verification and rate limiting
- **Error Handling**: Comprehensive error handling and recovery
- **Email Notifications**: Automated order confirmation emails
- **Digital Product Delivery**: Download link generation
- **Responsive UI**: Mobile-friendly payment interface

### 🔒 Security Features
- SHA256 signature verification
- Rate limiting on payment endpoints
- Input validation and sanitization
- HTTPS enforcement
- Secure headers implementation
- Transaction ID format validation
- Webhook signature verification

## File Structure

```
bundle-buy-bliss/
├── server/
│   ├── services/
│   │   └── phonepeService.js      # PhonePe API integration
│   ├── models/
│   │   └── Order.js               # Order data model
│   ├── middleware/
│   │   └── security.js            # Security middleware
│   ├── tests/
│   │   └── phonepe.test.js        # Integration tests
│   ├── api/
│   │   └── index.js               # Main server with routes
│   └── .env.example               # Environment configuration
├── src/
│   ├── pages/
│   │   ├── Cart.tsx               # Updated cart with PhonePe
│   │   ├── PaymentSuccess.tsx     # Success page
│   │   └── PaymentFailed.tsx      # Failure page
│   └── App.tsx                    # Updated routes
├── PHONEPE_TESTING_GUIDE.md       # Testing procedures
└── PHONEPE_INTEGRATION_GUIDE.md   # This file
```

## API Endpoints

### Payment Endpoints

#### 1. Create Order
```http
POST /api/phonepe/create-order
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9999999999",
  "orderItems": [
    {
      "id": "product-1",
      "name": "Digital Product",
      "price": 100,
      "quantity": 1
    }
  ],
  "totalAmount": 100
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "ORD_1234567890_abc123",
  "paymentUrl": "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay/...",
  "merchantTransactionId": "TXN_abc123def456"
}
```

#### 2. Payment Callback
```http
GET /api/phonepe/callback/:merchantTransactionId
```
Handles PhonePe payment completion callbacks and redirects users to success/failure pages.

#### 3. Check Payment Status
```http
GET /api/phonepe/status/:merchantTransactionId
```

**Response:**
```json
{
  "success": true,
  "status": "PAYMENT_SUCCESS",
  "data": {
    "merchantTransactionId": "TXN_abc123def456",
    "transactionId": "PHONEPE_TXN_789",
    "amount": 10000,
    "code": "PAYMENT_SUCCESS"
  }
}
```

#### 4. Webhook Handler
```http
POST /api/phonepe/webhook
Content-Type: application/json
X-VERIFY: signature

{
  "response": "base64_encoded_response",
  "checksum": "signature_checksum"
}
```

## Environment Configuration

### Development Environment
```env
# PhonePe UAT Configuration
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_SALT_INDEX=1

# Application URLs
APP_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:8080

# Database
MONGODB_URI=mongodb://localhost:27017/bundle-buy-bliss

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Environment
NODE_ENV=development
PORT=3000
```

### Production Environment
```env
# PhonePe Production Configuration
PHONEPE_MERCHANT_ID=your-production-merchant-id
PHONEPE_SALT_KEY=your-production-salt-key
PHONEPE_SALT_INDEX=1

# Application URLs
APP_BASE_URL=https://your-domain.com
FRONTEND_URL=https://your-frontend-domain.com

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/production

# Environment
NODE_ENV=production
PORT=3000
```

## Payment Flow

### 1. Order Creation Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant P as PhonePe
    participant D as Database

    U->>F: Add items to cart
    U->>F: Proceed to checkout
    F->>B: POST /api/phonepe/create-order
    B->>D: Create order record
    B->>P: Initiate payment
    P->>B: Return payment URL
    B->>F: Return payment URL
    F->>U: Redirect to PhonePe
```

### 2. Payment Processing Flow
```mermaid
sequenceDiagram
    participant U as User
    participant P as PhonePe
    participant B as Backend
    participant D as Database
    participant E as Email

    U->>P: Complete payment
    P->>B: Callback to /api/phonepe/callback
    B->>P: Verify payment status
    P->>B: Return payment result
    B->>D: Update order status
    B->>E: Send confirmation email
    B->>U: Redirect to success/failure page
```

## Error Handling

### Common Error Scenarios
1. **Payment Initiation Failure**
   - Invalid merchant credentials
   - Network connectivity issues
   - Invalid request payload

2. **Payment Processing Errors**
   - Insufficient funds
   - Card declined
   - Network timeout

3. **Callback Processing Issues**
   - Invalid signature
   - Order not found
   - Database connection failure

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "validation error details"
  }
}
```

## Security Considerations

### 1. Data Protection
- All sensitive data encrypted in transit
- Payment credentials stored securely
- PCI DSS compliance maintained

### 2. API Security
- Rate limiting implemented
- Input validation and sanitization
- SQL injection protection
- XSS protection

### 3. Transaction Security
- SHA256 signature verification
- Unique transaction IDs
- Callback URL validation
- Webhook signature verification

## Monitoring & Logging

### Key Metrics to Monitor
- Payment success rate
- Average transaction time
- Error frequency
- API response times
- Database performance

### Logging Strategy
```javascript
// Payment attempt logging
console.log(`[PAYMENT] ${timestamp} - Customer: ${email} - Amount: ${amount} - Status: ${status}`);

// Error logging
console.error(`[ERROR] ${timestamp} - ${errorType} - ${errorMessage} - TxnID: ${transactionId}`);

// Performance logging
console.log(`[PERF] ${timestamp} - Endpoint: ${endpoint} - Duration: ${duration}ms`);
```

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations completed
- [ ] Backup procedures tested

### Production Deployment
- [ ] Production credentials configured
- [ ] DNS settings updated
- [ ] Load balancer configured
- [ ] Monitoring tools active
- [ ] Error tracking enabled

### Post-Deployment
- [ ] End-to-end testing completed
- [ ] Payment flow verified
- [ ] Monitoring dashboards active
- [ ] Support team notified
- [ ] Documentation updated

## Maintenance & Support

### Regular Maintenance Tasks
- Monitor payment success rates
- Review error logs
- Update security certificates
- Performance optimization
- Database maintenance

### Support Procedures
1. **Payment Issues**
   - Check transaction logs
   - Verify order status
   - Contact PhonePe support if needed

2. **Technical Issues**
   - Review application logs
   - Check system resources
   - Verify database connectivity

## Troubleshooting Guide

### Common Issues

#### Issue: Payment initiation fails
**Symptoms:** Error during order creation
**Solution:**
1. Check environment variables
2. Verify merchant credentials
3. Test network connectivity
4. Review request payload

#### Issue: Callback not received
**Symptoms:** Payment completes but order not updated
**Solution:**
1. Verify callback URL accessibility
2. Check firewall settings
3. Review webhook logs
4. Test signature verification

#### Issue: Amount mismatch
**Symptoms:** Different amounts displayed
**Solution:**
1. Check cart calculations
2. Verify currency handling
3. Review decimal precision
4. Test with different amounts

## Performance Optimization

### Backend Optimizations
- Database query optimization
- Connection pooling
- Caching strategies
- Async processing

### Frontend Optimizations
- Code splitting
- Lazy loading
- Image optimization
- Bundle size reduction

## Compliance & Standards

### PCI DSS Compliance
- No card data stored locally
- Secure transmission protocols
- Regular security audits
- Access control implementation

### Data Privacy
- GDPR compliance
- Data retention policies
- User consent management
- Privacy policy updates

## Future Enhancements

### Planned Features
- Multiple payment methods
- Subscription payments
- Refund processing
- Advanced analytics
- Mobile app integration

### Technical Improvements
- GraphQL API
- Microservices architecture
- Real-time notifications
- Advanced monitoring
- AI-powered fraud detection

## Support Contacts

### Technical Support
- Internal Team: [team@company.com]
- PhonePe Support: [PhonePe Developer Portal](https://developer.phonepe.com)

### Emergency Contacts
- On-call Engineer: [emergency@company.com]
- System Administrator: [admin@company.com]

## Quick Start Guide

### 1. Installation
```bash
# Clone the repository
git clone <repository-url>
cd bundle-buy-bliss

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ..
npm install
```

### 2. Configuration
```bash
# Copy environment file
cp server/.env.example server/.env

# Edit environment variables
nano server/.env
```

### 3. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas connection string in .env
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd ..
npm run dev
```

### 5. Test Integration
1. Navigate to `http://localhost:8080`
2. Add products to cart
3. Proceed to checkout
4. Use test credentials for payment

---

**Last Updated:** January 2025
**Version:** 1.0
**Author:** AI Development Team
