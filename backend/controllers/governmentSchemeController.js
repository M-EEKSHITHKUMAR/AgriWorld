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

// @route POST /api/schemes (admin only)
const createScheme = asyncHandler(async (req, res) => {
  const { name, level, state, shortDescription, benefits, officialLink, eligibility } = req.body;

  if (!name || !level || !shortDescription || !officialLink) {
    res.status(400);
    throw new Error('Name, level, short description, and official link are required');
  }

  if (level === 'State' && !state) {
    res.status(400);
    throw new Error('State is required for a state-level scheme');
  }

  const scheme = await GovernmentScheme.create({
    name,
    level,
    state: level === 'State' ? state : '',
    shortDescription,
    benefits: benefits || [],
    officialLink,
    eligibility: eligibility || {},
  });

  res.status(201).json({ success: true, scheme });
});

module.exports = { getSchemes, createScheme };
