const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth');
const Order = require('./Order');

// Place order
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const order = new Order({ user: req.user.id, items, totalAmount });
    await order.save();
    res.json({ message: '✅ Order placed!', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fast checkout (skip auth for demo)
router.post('/fast', async (req, res) => {
  try {
    const { items, totalAmount, userEmail } = req.body;
    const order = new Order({ user: null, items, totalAmount, status: 'Fast Checkout' });
    await order.save();
    res.json({ message: '✅ Fast order placed!', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get my orders
router.get('/myorders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
