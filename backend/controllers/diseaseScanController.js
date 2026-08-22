const asyncHandler = require('../utils/asyncHandler');
const fs = require('fs/promises');
const DiseaseScan = require('../models/DiseaseScan');
const mlService = require('../services/mlService');

// @route POST /api/disease-scan
const scanDisease = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a leaf image');
  }

  const imagePath = `/uploads/${req.file.filename}`;

  let prediction;
  try {
    prediction = await mlService.predictDisease(req.file.path);
  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});
    res.status(502);
    throw new Error(error.message || 'Disease detection service is unavailable');
  }

  const scan = await DiseaseScan.create({
    user: req.user._id,
    image: imagePath,
    disease: prediction.disease,
    confidence: prediction.confidence,
    treatment: prediction.treatment,
    preventiveMeasures: prediction.preventiveMeasures,
    pesticideRecommendations: prediction.pesticides,
  });

  res.status(201).json({ success: true, scan });
});

// @route GET /api/disease-scan/history
const getScanHistory = asyncHandler(async (req, res) => {
  const scans = await DiseaseScan.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: scans.length, scans });
});

// @route GET /api/disease-scan/:id
const getScanById = asyncHandler(async (req, res) => {
  const scan = await DiseaseScan.findOne({ _id: req.params.id, user: req.user._id });
  if (!scan) {
    res.status(404);
    throw new Error('Scan not found');
  }
  res.json({ success: true, scan });
});

// @route DELETE /api/disease-scan/:id
const deleteScan = asyncHandler(async (req, res) => {
  const scan = await DiseaseScan.findOne({ _id: req.params.id, user: req.user._id });
  if (!scan) {
    res.status(404);
    throw new Error('Scan not found');
  }
  await scan.deleteOne();
  res.json({ success: true, message: 'Scan deleted' });
});

module.exports = { scanDisease, getScanHistory, getScanById, deleteScan };
