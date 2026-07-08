const express = require('express');
const {
  getCropWorks,
  getReminders,
  createCropWork,
  updateCropWork,
  markWorkCompleted,
  snoozeReminder,
  deleteCropWork,
} = require('../controllers/cropWorkController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getCropWorks);
router.get('/reminders', getReminders);
router.post('/', createCropWork);
router.put('/:id', updateCropWork);
router.patch('/:id/complete', markWorkCompleted);
router.patch('/:id/snooze', snoozeReminder);
router.delete('/:id', deleteCropWork);

module.exports = router;
