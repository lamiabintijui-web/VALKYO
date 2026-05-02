const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  cat: { type: String, required: true },
  emoji: String,
  price: { type: Number, required: true },
  oldPrice: Number,
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  badge: String,
  desc: String,
  sizes: [String],
  ingredients: String,
  image: String,
  stock: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);