const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./auth'));
app.use('/api/products', require('./products'));
app.use('/api/cart', require('./cart'));
app.use('/api/orders', require('./orders'));
app.use('/api/ai', require('./ai'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'ShopCon API is running!' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB Error:', err));
