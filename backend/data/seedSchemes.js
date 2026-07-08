require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const GovernmentScheme = require('../models/GovernmentScheme');
const schemesData = require('./schemesData');

const seed = async () => {
  await connectDB();
  await GovernmentScheme.deleteMany({});
  await GovernmentScheme.insertMany(schemesData);
  console.log(`Seeded ${schemesData.length} government schemes`);
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
