const express = require('express');
const { getSchemes, createScheme } = require('../controllers/governmentSchemeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getSchemes);
router.post('/', protect, adminOnly, createScheme);

module.exports = router;
