const asyncHandler = require('../utils/asyncHandler');
const DiseaseScan = require('../models/DiseaseScan');
const CropWork = require('../models/CropWork');
const GovernmentScheme = require('../models/GovernmentScheme');
const MarketplaceListing = require('../models/MarketplaceListing');

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

// @route GET /api/dashboard/summary
const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const today = new Date();

  const [recentScans, upcomingTasksCount, schemesCount, marketplaceCount, todaysTasks] = await Promise.all([
    DiseaseScan.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
    CropWork.countDocuments({ user: userId, status: 'Planned', workDate: { $gte: today } }),
    GovernmentScheme.countDocuments({}),
    MarketplaceListing.countDocuments({}),
    CropWork.find({
      user: userId,
      reminderDate: { $gte: startOfDay(today), $lte: endOfDay(today) },
      reminderStatus: { $in: ['Pending', 'Snoozed'] },
    }).sort({ reminderDate: 1 }),
  ]);

  res.json({
    success: true,
    summary: {
      recentScans,
      upcomingTasksCount,
      schemesCount,
      marketplaceCount,
      todaysTasks,
    },
  });
});

module.exports = { getSummary };
