const express = require('express');
const router = express.Router();

// Simple in-memory cart for demo (replace with DB logic later)
let cartItems = [];

router.get('/', (req, res) => {
  res.json(cartItems);
});

router.post('/', (req, res) => {
  const item = req.body;
  cartItems.push(item);
  res.status(201).json({ message: 'Item added to cart', item });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  cartItems = cartItems.filter(item => item.id !== id);
  res.json({ message: 'Item removed from cart' });
});

router.delete('/', (req, res) => {
  cartItems = [];
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
