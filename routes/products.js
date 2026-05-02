const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { cat, sort, page = 1, limit = 12 } = req.query;
    const query = cat && cat !== 'all' ? { cat } : {};
    const products = await Product.find(query)
      .sort(sort === 'price-asc' ? 'price' : sort === 'price-desc' ? '-price' : '-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Product.countDocuments(query);
    res.json({ success: true, products, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const slug = req.body.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const product = await Product.create({ ...req.body, slug });
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;