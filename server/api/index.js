const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch'); // Ensure this is installed in your project

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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
  image: String,
  category: String,
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = app;
