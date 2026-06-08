// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
    register, login, getProfile,
    updateProfile, uploadAvatar, logout,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadAvatar: uploadAvatarMiddleware } = require('../config/multer');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, uploadAvatarMiddleware.single('avatar'), uploadAvatar);

module.exports = router;