const mongoose = require('mongoose');

const diseaseScanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: true },
    disease: { type: String, required: true },
    confidence: { type: Number, required: true },
    treatment: [{ type: String }],
    preventiveMeasures: [{ type: String }],
    pesticideRecommendations: [
      {
        name: { type: String },
        description: { type: String },
        score: { type: Number },
      },
    ],
    scanDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DiseaseScan', diseaseScanSchema);
