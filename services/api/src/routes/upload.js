const express = require('express');
const multer = require('multer');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  uploadImage,
  uploadMultipleImages,
  deleteImage
} = require('../controllers/uploadController');

// Configure multer with memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB limit
  }
});

// Error handler for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, error: 'File too large. Maximum size is 25MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ success: false, error: 'Too many files. Maximum is 10 files.' });
    }
    return res.status(400).json({ success: false, error: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
  next();
};

// POST /api/upload - Upload single image
router.post('/', requireAuth, upload.single('image'), handleMulterError, uploadImage);

// POST /api/upload/multiple - Upload multiple images (max 10)
router.post('/multiple', requireAuth, upload.array('images', 10), handleMulterError, uploadMultipleImages);

// DELETE /api/upload/:publicId - Delete image (publicId can contain slashes)
router.delete('/*', requireAuth, deleteImage);

module.exports = router;
