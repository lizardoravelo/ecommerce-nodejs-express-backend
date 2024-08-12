const User = require('../model/user');
const handleErrorResponse = require('../middleware/error-handler');
const jwt = require('jsonwebtoken');
const config = require('../config');

const userCtrl = {};

// Register a new user
userCtrl.register = async (req, res) => {
  const { name, email, password, address, phone, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const newUser = new User({
      name,
      email,
      password,
      address,
      phone,
      role,
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      message: 'User registered successfully',
      user: savedUser,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Login a user
userCtrl.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, config.secret, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Get all users (protected)
userCtrl.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('role');
    res.status(200).json(users);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Get user by ID (protected)
userCtrl.getUserById = async (req, res) => {
  try {
    // Ensure the user can only access their own data or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You can only access your own data' });
    }
    const user = await User.findById(req.params.id).populate('role');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Update user by ID (protected)
userCtrl.updateUserById = async (req, res) => {
  const { name, email, password, address, phone, role, active } = req.body;

  try {
    // Ensure the user can only access their own data or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You can only access your own data' });
    }
    const updatedFields = { name, email, address, phone, role, active };
    if (password) {
      updatedFields.password = password;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Delete user by ID (protected)
userCtrl.deleteUserById = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

module.exports = userCtrl;
