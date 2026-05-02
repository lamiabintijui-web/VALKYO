const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const router = express.Router();

router.post('/products', protect, admin, upload.single('image'), (req, res) => {
  try {
    res.json({ 
      success: true, 
      image: `/uploads/${req.file.filename}` 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;