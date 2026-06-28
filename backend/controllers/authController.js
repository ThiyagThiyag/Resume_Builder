import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import sendSuccessEmail from '../utils/sendSuccessEmail.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '10m',
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register (Send OTP)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const otp = generateOTP();

    // Delete any existing OTPs for this email to prevent spam/duplicates
    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
    });

    await sendEmail({
      email,
      subject: 'Resumify - Verify your email',
      otp,
    });

    res.status(201).json({
      success: true,
      message: 'OTP sent to email',
      requiresVerification: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP and Create User
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyAndCreateUser = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!email || !otp || !name || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all details and OTP' });
    }

    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Check again just in case they verified twice concurrently
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    // Clean up OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    // Send the beautiful success welcome email asynchronously
    sendSuccessEmail({
      email: user.email,
      subject: 'Welcome to Resumify! Registration Successful 🎉',
      name: user.name,
    }).catch(err => console.error("Error sending success email:", err));

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
