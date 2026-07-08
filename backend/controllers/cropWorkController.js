const asyncHandler = require('../utils/asyncHandler');
const CropWork = require('../models/CropWork');

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};
const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// @route GET /api/crop-works
const getCropWorks = asyncHandler(async (req, res) => {
  const works = await CropWork.find({ user: req.user._id }).sort({ workDate: -1 });
  res.json({ success: true, count: works.length, works });
});

// @route GET /api/crop-works/reminders?tab=today|upcoming|completed
const getReminders = asyncHandler(async (req, res) => {
  const { tab = 'today' } = req.query;
  const today = new Date();
  let filter = { user: req.user._id, reminderDate: { $exists: true, $ne: null } };

  if (tab === 'today') {
    filter.reminderDate = { $gte: startOfDay(today), $lte: endOfDay(today) };
    filter.reminderStatus = { $in: ['Pending', 'Snoozed'] };
  } else if (tab === 'upcoming') {
    filter.reminderDate = { $gt: endOfDay(today) };
    filter.reminderStatus = { $in: ['Pending', 'Snoozed'] };
  } else if (tab === 'completed') {
    filter.reminderStatus = 'Completed';
  }

  const reminders = await CropWork.find(filter).sort({ reminderDate: 1 });
  res.json({ success: true, count: reminders.length, reminders });
});

// @route POST /api/crop-works
const createCropWork = asyncHandler(async (req, res) => {
  const { cropName, workName, customWorkName, workDate, notes, status, reminderDate, reminderTime } = req.body;

  if (!cropName || !workName || !workDate) {
    res.status(400);
    throw new Error('Crop name, work name, and work date are required');
  }

  const work = await CropWork.create({
    user: req.user._id,
    cropName,
    workName,
    customWorkName: customWorkName || '',
    workDate,
    notes: notes || '',
    status: status || 'Planned',
    reminderDate: reminderDate || undefined,
    reminderTime: reminderTime || '',
    reminderStatus: reminderDate ? 'Pending' : 'None',
  });

  res.status(201).json({ success: true, work });
});

// @route PUT /api/crop-works/:id
const updateCropWork = asyncHandler(async (req, res) => {
  const work = await CropWork.findOne({ _id: req.params.id, user: req.user._id });
  if (!work) {
    res.status(404);
    throw new Error('Crop work not found');
  }

  const fields = ['cropName', 'workName', 'customWorkName', 'workDate', 'notes', 'status', 'reminderDate', 'reminderTime'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) work[field] = req.body[field];
  });

  if (req.body.reminderDate && work.reminderStatus === 'None') {
    work.reminderStatus = 'Pending';
  }

  await work.save();
  res.json({ success: true, work });
});

// @route PATCH /api/crop-works/:id/complete
const markWorkCompleted = asyncHandler(async (req, res) => {
  const work = await CropWork.findOne({ _id: req.params.id, user: req.user._id });
  if (!work) {
    res.status(404);
    throw new Error('Crop work not found');
  }
  work.status = 'Completed';
  if (work.reminderStatus !== 'None') work.reminderStatus = 'Completed';
  await work.save();
  res.json({ success: true, work });
});

// @route PATCH /api/crop-works/:id/snooze
const snoozeReminder = asyncHandler(async (req, res) => {
  const work = await CropWork.findOne({ _id: req.params.id, user: req.user._id });
  if (!work) {
    res.status(404);
    throw new Error('Crop work not found');
  }
  const days = Number(req.body.days) || 1;
  const newDate = new Date(work.reminderDate || Date.now());
  newDate.setDate(newDate.getDate() + days);
  work.reminderDate = newDate;
  work.reminderStatus = 'Snoozed';
  await work.save();
  res.json({ success: true, work });
});

// @route DELETE /api/crop-works/:id
const deleteCropWork = asyncHandler(async (req, res) => {
  const work = await CropWork.findOne({ _id: req.params.id, user: req.user._id });
  if (!work) {
    res.status(404);
    throw new Error('Crop work not found');
  }
  await work.deleteOne();
  res.json({ success: true, message: 'Crop work deleted' });
});

module.exports = {
  getCropWorks,
  getReminders,
  createCropWork,
  updateCropWork,
  markWorkCompleted,
  snoozeReminder,
  deleteCropWork,
};
