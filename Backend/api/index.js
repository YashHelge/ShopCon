const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('../auth');
const productsRouter = require('../products');
const cartRouter = require('../cart');
const ordersRouter = require('../orders');
const aiRouter = require('../ai');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/ai', aiRouter);

app.get('/api', (req, res) => {
  res.json({ message: 'ShopCon API is running!' });
});

const MONGO_URI = process.env.MONGO_URI;
let cached = global.__shopcon_mongo;

async function connectDb() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined.');
  }

  const conn = await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cached = global.__shopcon_mongo = { conn };
  return conn;
}

module.exports = async (req, res) => {
  try {
    await connectDb();
    app(req, res);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
};
