require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const startReminderCron = require('./services/reminderCron');

const authRoutes = require('./routes/authRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const diseaseScanRoutes = require('./routes/diseaseScanRoutes');
const cropWorkRoutes = require('./routes/cropWorkRoutes');
const governmentSchemeRoutes = require('./routes/governmentSchemeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'AgriWorld API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/disease-scan', diseaseScanRoutes);
app.use('/api/crop-works', cropWorkRoutes);
app.use('/api/schemes', governmentSchemeRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

startReminderCron();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AgriWorld API listening on port ${PORT}`));
