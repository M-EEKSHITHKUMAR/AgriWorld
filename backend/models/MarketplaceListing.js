const mongoose = require('mongoose');

const marketplaceListingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    equipmentName: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Tractor', 'Harvester', 'Rotavator', 'Seeder', 'Sprayer', 'Water Pump', 'Cultivator', 'Other'],
    },
    description: { type: String, required: true },
    rentalPrice: { type: Number, required: true, min: 0 },
    priceUnit: { type: String, required: true, enum: ['Hour', 'Day'] },
    images: [{ type: String }],
    availabilityStatus: { type: String, enum: ['Available', 'Unavailable'], default: 'Available' },
    state: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String, required: true },
    contactNumber: { type: String, required: true },
    whatsappNumber: { type: String, default: '' },
  },
  { timestamps: true }
);

marketplaceListingSchema.index({ category: 1, state: 1, district: 1, availabilityStatus: 1 });

module.exports = mongoose.model('MarketplaceListing', marketplaceListingSchema);
