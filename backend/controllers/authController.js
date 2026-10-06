const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new farmer
// @route   POST /api/auth/farmer/register
// @access  Public
const registerFarmer = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  try {
    if (!name || !mobile || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, mobile, and password' });
    }

    const userExists = await User.findOne({ mobile });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this mobile number already exists' });
    }

    const user = await User.create({
      name,
      mobile,
      email,
      password,
      role: 'farmer'
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token: generateToken(user._id, user.role),
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth farmer & get token
// @route   POST /api/auth/farmer/login
// @access  Public
const loginFarmer = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const user = await User.findOne({ mobile }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (user.role !== 'farmer') {
        return res.status(403).json({ success: false, message: 'Not authorized as farmer' });
      }
      if (user.status !== 'active') {
        return res.status(403).json({ success: false, message: 'Account is inactive' });
      }

      res.json({
        success: true,
        message: 'Login successful',
        token: generateToken(user._id, user.role),
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid mobile number or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth driver & get token
// @route   POST /api/auth/driver/login
// @access  Public
const loginDriver = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const user = await User.findOne({ mobile }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (user.role !== 'driver') {
        return res.status(403).json({ success: false, message: 'Not authorized as driver' });
      }
      if (user.status !== 'active') {
        return res.status(403).json({ success: false, message: 'Account is inactive' });
      }

      res.json({
        success: true,
        message: 'Login successful',
        token: generateToken(user._id, user.role),
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid driver ID/mobile or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth owner & get token
// @route   POST /api/auth/owner/login
// @access  Public
const loginOwner = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const user = await User.findOne({ mobile }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (user.role !== 'owner') {
        return res.status(403).json({ success: false, message: 'Not authorized as owner' });
      }
      if (user.status !== 'active') {
        return res.status(403).json({ success: false, message: 'Account is inactive' });
      }

      res.json({
        success: true,
        message: 'Login successful',
        token: generateToken(user._id, user.role),
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid mobile number or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          role: user.role,
          address: user.address,
          licenceNumber: user.licenceNumber,
          locationSharingEnabled: user.locationSharingEnabled
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email !== undefined ? req.body.email : user.email;
    user.mobile = req.body.mobile || user.mobile;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    user.licenceNumber = req.body.licenceNumber !== undefined ? req.body.licenceNumber : user.licenceNumber;
    
    if (req.body.locationSharingEnabled !== undefined) {
      user.locationSharingEnabled = req.body.locationSharingEnabled;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        mobile: updatedUser.mobile,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        licenceNumber: updatedUser.licenceNumber,
        locationSharingEnabled: updatedUser.locationSharingEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerFarmer,
  loginFarmer,
  loginDriver,
  loginOwner,
  getMe,
  updateProfile
};
