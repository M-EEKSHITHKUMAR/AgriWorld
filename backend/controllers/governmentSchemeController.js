const asyncHandler = require('../utils/asyncHandler');
const GovernmentScheme = require('../models/GovernmentScheme');

// @route GET /api/schemes?state=Karnataka
const getSchemes = asyncHandler(async (req, res) => {
  const { state } = req.query;

  const central = await GovernmentScheme.find({ level: 'Central' }).sort({ name: 1 });
  const stateSchemes = state
    ? await GovernmentScheme.find({ level: 'State', state }).sort({ name: 1 })
    : [];

  res.json({ success: true, central, state: stateSchemes });
});

module.exports = { getSchemes };
