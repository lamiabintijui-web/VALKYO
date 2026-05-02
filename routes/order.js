const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/email');
const router = express.Router();

// Create order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, shippingMethod, promoCode } = req.body;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.qty) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product?.name || 'product'}` 
        });
      }
      
      orderItems.push({
        product: item.product,
        qty: item.qty,
        price: product.price
      });
      
      subtotal += product.price * item.qty;
      
      // Update stock
      product.stock -= item.qty;
      await product.save();
    }

    // Apply discount
    let discount = 0;
    if (promoCode === 'GLOW3' || promoCode === 'LUMIERE15') {
      discount = subtotal * 0.15;
    }

    // Shipping cost
    const freeThreshold = 75;
    let shippingCost = 0;
    const country = shippingAddress.country;
    
    if (country.includes('EU') || country.includes('Europe')) {
      shippingCost = subtotal >= freeThreshold ? 0 : 12;
    } else if (country.includes('US') || country.includes('America')) {
      shippingCost = subtotal >= freeThreshold ? 0 : 15;
    }

    const total = subtotal - discount + shippingCost;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      shippingMethod,
      shippingCost,
      subtotal,
      discount,
      total,
      promoCode
    });

    // Send confirmation email
    await sendEmail({
      email: shippingAddress.email,
      subject: 'Order Confirmed - LUMIÈRE',
      html: `
        <h2>✨ Order Confirmed!</h2>
        <p>Thank you for your purchase. Order #${order._id.slice(-8).toUpperCase()}</p>
        <p><strong>Total: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</strong></p>
        <p>We'll notify you when your order ships.</p>
      `
    });

    res.status(201).json({ 
      success: true, 
      order: order._id,
      message: 'Order created successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price image')
      .sort('-createdAt');
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name price image');
    
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;