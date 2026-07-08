const express = require('express');
const { scanDisease, getScanHistory, getScanById, deleteScan } = require('../controllers/diseaseScanController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', protect, upload.single('image'), scanDisease);
router.get('/history', protect, getScanHistory);
router.get('/:id', protect, getScanById);
router.delete('/:id', protect, deleteScan);

module.exports = router;
