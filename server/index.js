const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://digital-hub-xi.vercel.app'] 
    : ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
console.log(process.env.NODE_ENV);
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
});

const Product = mongoose.model('Product', productSchema);

// Simple auth middleware
const requireAuth = (req, res, next) => {
  const { username, password } = req.headers;
  
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (username === adminUsername && password === adminPassword) {
    return next();
  } else {
    return res.status(401).json({ message: 'Authentication required' });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bundle Buy Bliss API is running!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (username === adminUsername && password === adminPassword) {
      res.json({ 
        message: 'Login successful',
        user: { username }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/status', (req, res) => {
  const { username, password } = req.headers;
  
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (username === adminUsername && password === adminPassword) {
    res.json({ 
      authenticated: true, 
      user: { username }
    });
  } else {
    res.json({ authenticated: false });
  }
});

app.get('/api/products', requireAuth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/products', requireAuth, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      updatedAt: new Date()
    });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MongoDB connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI not provided');
}
app.get('/', (req, res) => {
  res.send('Server is running on localhost');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
// Export for Vercel
module.exports = app;


