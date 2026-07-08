const asyncHandler = require('../utils/asyncHandler');
const MarketplaceListing = require('../models/MarketplaceListing');

// @route GET /api/marketplace
const getListings = asyncHandler(async (req, res) => {
  const { category, state, district, availabilityStatus, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (state) filter.state = state;
  if (district) filter.district = district;
  if (availabilityStatus) filter.availabilityStatus = availabilityStatus;
  if (search) filter.equipmentName = { $regex: search, $options: 'i' };

  const listings = await MarketplaceListing.find(filter)
    .populate('owner', 'name mobile')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: listings.length, listings });
});

// @route GET /api/marketplace/mine
const getMyListings = asyncHandler(async (req, res) => {
  const listings = await MarketplaceListing.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: listings.length, listings });
});

// @route GET /api/marketplace/:id
const getListingById = asyncHandler(async (req, res) => {
  const listing = await MarketplaceListing.findById(req.params.id).populate('owner', 'name mobile');
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  res.json({ success: true, listing });
});

// @route POST /api/marketplace
const createListing = asyncHandler(async (req, res) => {
  const {
    equipmentName,
    category,
    description,
    rentalPrice,
    priceUnit,
    availabilityStatus,
    state,
    district,
    village,
    contactNumber,
    whatsappNumber,
  } = req.body;

  if (!equipmentName || !category || !description || !rentalPrice || !priceUnit || !state || !district || !village || !contactNumber) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

  const listing = await MarketplaceListing.create({
    owner: req.user._id,
    equipmentName,
    category,
    description,
    rentalPrice,
    priceUnit,
    availabilityStatus: availabilityStatus || 'Available',
    images,
    state,
    district,
    village,
    contactNumber,
    whatsappNumber: whatsappNumber || '',
  });

  res.status(201).json({ success: true, listing });
});

// @route PUT /api/marketplace/:id
const updateListing = asyncHandler(async (req, res) => {
  const listing = await MarketplaceListing.findById(req.params.id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  if (listing.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this listing');
  }

  const fields = [
    'equipmentName', 'category', 'description', 'rentalPrice', 'priceUnit',
    'availabilityStatus', 'state', 'district', 'village', 'contactNumber', 'whatsappNumber',
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) listing[field] = req.body[field];
  });

  if (req.files && req.files.length > 0) {
    listing.images = req.files.map((f) => `/uploads/${f.filename}`);
  }

  await listing.save();
  res.json({ success: true, listing });
});

// @route DELETE /api/marketplace/:id
const deleteListing = asyncHandler(async (req, res) => {
  const listing = await MarketplaceListing.findById(req.params.id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }
  if (listing.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this listing');
  }
  await listing.deleteOne();
  res.json({ success: true, message: 'Listing deleted' });
});

module.exports = { getListings, getMyListings, getListingById, createListing, updateListing, deleteListing };
