const mongoose = require('mongoose');

const governmentSchemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: { type: String, enum: ['Central', 'State'], required: true },
    state: { type: String, default: '' },
    shortDescription: { type: String, required: true },
    benefits: [{ type: String }],
    officialLink: { type: String, required: true },
    eligibility: {
      eligibleFarmers: { type: String, default: '' },
      landOwnershipRequirement: { type: String, default: '' },
      incomeCriteria: { type: String, default: '' },
      requiredDocuments: [{ type: String }],
      additionalNotes: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

governmentSchemeSchema.index({ level: 1, state: 1 });

module.exports = mongoose.model('GovernmentScheme', governmentSchemeSchema);
