const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  mobile: user.mobile,
  state: user.state,
  district: user.district,
  village: user.village,
  profilePicture: user.profilePicture,
  role: user.role,
});

// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, mobile, state, district, village } = req.body;

  if (!name || !email || !password || !mobile || !state || !district || !village) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const profilePicture = req.file ? `/uploads/${req.file.filename}` : '';

  const user = await User.create({ name, email, password, mobile, state, district, village, profilePicture });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: formatUser(user),
  });
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: formatUser(user),
  });
});

// @route POST /api/auth/admin-login
const adminLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'admin';

  if (username !== validUsername || password !== validPassword) {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }

  const adminIdentifier = 'admin@agriworld.local';
  let adminUser = await User.findOne({ email: adminIdentifier });

  if (!adminUser) {
    adminUser = await User.create({
      name: 'Administrator',
      email: adminIdentifier,
      password: `${validUsername}-${validPassword}-${Date.now()}`,
      mobile: '0000000000',
      state: 'N/A',
      district: 'N/A',
      village: 'N/A',
      role: 'admin',
    });
  }

  res.json({
    success: true,
    token: generateToken(adminUser._id),
    user: formatUser(adminUser),
  });
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: formatUser(req.user) });
});

// @route PUT /api/auth/me
const updateMe = asyncHandler(async (req, res) => {
  const fields = ['name', 'mobile', 'state', 'district', 'village'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });

  if (req.file) {
    req.user.profilePicture = `/uploads/${req.file.filename}`;
  }

  await req.user.save();
  res.json({ success: true, user: formatUser(req.user) });
});

module.exports = { register, login, adminLogin, getMe, updateMe };
