const express = require('express');
const { getSchemes } = require('../controllers/governmentSchemeController');

const router = express.Router();

router.get('/', getSchemes);

module.exports = router;
