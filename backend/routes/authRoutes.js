const express = require('express');
const { register, login, getMe, updateMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', upload.single('profilePicture'), register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('profilePicture'), updateMe);

module.exports = router;
