const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, username, password');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Product Schema - make sure it matches your MongoDB Atlas collection
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
  collection: 'products' // Explicitly specify collection name
});

const Product = mongoose.model('Product', productSchema);

// Simple auth middleware
const requireAuth = (req, res, next) => {
  const { username, password } = req.body;
  
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (username === "digital.district@official@gmail.com" && password === "emmy@123HAB") {
    return next();
  } else {
    return res.status(401).json({ message: 'Authentication required' });
  }
};

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
    console.log(username, password);
    const adminUsername = process.env.ADMIN_USERNAME ;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (username === "digital.district@official@gmail.com" && password === "emmy@123HAB") {
      res.json({ 
        message: 'Login successful',
        user: { username }
      });
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
    console.error('Get products error:', error);
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
    console.error('Create product error:', error);
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
    console.error('Update product error:', error);
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
    console.error('Delete product error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/products/public', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, number, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    
    // Send to Google Apps Script
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbzufSsAi_AptsV4eb5LHvV8ie4_nbUrzhwh-cOI2x2-k5GDVHxKb07mcmUrS_3AwFtk1w/exec'; // Replace with your actual script URL
    
    const googleResponse = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        number: number || '',
        message
      })
    });
    
    if (googleResponse.ok) {
      console.log('Contact form sent to Google Sheets successfully');
      res.json({ 
        message: 'Contact form submitted successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('Google Apps Script error:', await googleResponse.text());
      res.status(500).json({ message: 'Failed to submit form' });
    }
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// MongoDB connection with better error handling
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log('Connected to MongoDB');
    } else {
      console.warn('MONGODB_URI not provided');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Connect to database
connectToDatabase();
const PORT = process.env.PORT || 3000; // Default port if not specified in environment variables
app.listen(PORT, () => {
 console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

// Export for Vercel
module.exports = app;
