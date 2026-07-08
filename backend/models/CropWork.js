const mongoose = require('mongoose');

const cropWorkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropName: { type: String, required: true, trim: true },
    workName: {
      type: String,
      required: true,
      enum: [
        'Irrigation',
        'Fertilizer Applied',
        'Weed Removal',
        'Fungicide Spray',
        'Pesticide Spray',
        'Soil Testing',
        'Harvest',
        'Custom Work',
      ],
    },
    customWorkName: { type: String, default: '' },
    workDate: { type: Date, required: true },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['Completed', 'Planned'], default: 'Planned' },
    reminderDate: { type: Date },
    reminderTime: { type: String, default: '' },
    reminderStatus: { type: String, enum: ['None', 'Pending', 'Completed', 'Snoozed'], default: 'None' },
  },
  { timestamps: true }
);

cropWorkSchema.index({ user: 1, workDate: -1 });
cropWorkSchema.index({ user: 1, reminderDate: 1 });

module.exports = mongoose.model('CropWork', cropWorkSchema);
