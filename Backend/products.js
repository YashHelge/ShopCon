const express = require('express');
const router = express.Router();
const Product = require('./Product');
const multer = require('multer');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(process.env.TMPDIR || process.env.TEMP || '/tmp', 'shopcon_uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Get all products (with optional search/filter)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category && category !== 'All') query.category = category;

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    const product = new Product({ name, description, price, category, image });
    await product.save();
    res.json({ message: 'Product added', product });
  } catch (err) {
    res.status(500).json({ message: 'Add error', error: err.message });
  }
});

// Seed sample products (run once)
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany();
    const products = [
      { name: 'Wireless Headphones', description: 'Premium noise-cancelling headphones', price: 2999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', stock: 15, rating: 5 },
      { name: 'Running Shoes', description: 'Lightweight sports shoes for daily run', price: 1499, category: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', stock: 20, rating: 4 },
      { name: 'Backpack', description: 'Durable 30L travel backpack', price: 899, category: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300', stock: 12, rating: 4 },
      { name: 'Smart Watch', description: 'Fitness tracker with heart rate monitor', price: 3499, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', stock: 8, rating: 5 },
      { name: 'Sunglasses', description: 'UV400 polarized sunglasses', price: 599, category: 'Fashion', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300', stock: 25, rating: 4 },
      { name: 'Laptop Stand', description: 'Adjustable aluminum laptop stand', price: 799, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300', stock: 18, rating: 4 },
      { name: 'Water Bottle', description: 'Insulated stainless steel bottle 1L', price: 399, category: 'Accessories', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300', stock: 30, rating: 4 },
      { name: 'Casual T-Shirt', description: 'Premium cotton everyday wear', price: 349, category: 'Fashion', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300', stock: 50, rating: 3 },
    ];
    await Product.insertMany(products);
    res.json({ message: '✅ Products seeded successfully!', count: products.length });
  } catch (err) {
    res.status(500).json({ message: 'Seed error', error: err.message });
  }
});

// Search products by image
router.post('/search-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Describe this product image in detail, focusing on what it is, color, style, etc. Keep it concise.' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}` } }
          ]
        }
      ],
      max_tokens: 100
    });

    const description = response.choices[0].message.content;
    const products = await Product.find({ name: { $regex: description, $options: 'i' } }).limit(10);

    fs.unlinkSync(imagePath); // Clean up
    res.json({ description, products });
  } catch (err) {
    res.status(500).json({ message: 'Image search error', error: err.message });
  }
});

module.exports = router;
