const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ValidationError, ConflictError, UnauthorizedError } = require('../utils/customErrors');

// Helper to generate Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Register User
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      throw new ValidationError('Name, email, and password are required');
    }

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      throw new ConflictError('User already exists');
    }

    // Hash password (security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    res.status(201).json({
      success: true,
      token: generateToken(user.id, user.role),
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    // Check password
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        token: generateToken(user.id, user.role),
        user: { id: user.id, name: user.name, role: user.role }
      });
    } else {
      throw new UnauthorizedError('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};