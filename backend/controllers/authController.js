const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Built-in Node module for generating tokens
const { User } = require('../models');
const { ValidationError, ConflictError, UnauthorizedError, NotFoundError } = require('../utils/customErrors');
const sendEmail = require('../utils/sendEmail'); // Import the new email utility
const { Op } = require('sequelize'); // Needed for checking expiration dates
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Helper to generate Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// ✅ Helper: Validate Password Strength
// Rules: At least 8 chars, 1 Uppercase, 1 Digit
const validatePassword = (password) => {
  const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
};

// Register User
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      throw new ValidationError('Name, email, and password are required');
    }

    // ✅ Validate Password Strength
    if (!validatePassword(password)) {
      throw new ValidationError(
        'Password must be at least 8 characters long, contain at least 1 uppercase letter, and 1 number.'
      );
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
    // Note: In a real app, you might restrict creating 'super_admin' here directly
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'employee' // Default to employee
    });

    return sendSuccess(res, 'User registered successfully', {
      token: generateToken(user.id, user.role),
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }, 201);
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
      return sendSuccess(res, 'Login successful', {
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

// ✅ NEW: Forgot Password (Sends Email)
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError('There is no user with that email address');
    }

    // 2. Generate Reset Token (Random Hex String)
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 3. Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 4. Set expire time (10 minutes from now)
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // 5. Create Reset URL (Point this to your Frontend Route)
    // Make sure FRONTEND_URL is set in your .env (e.g., https://srt-dev.vercel.app)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      You are receiving this email because you (or someone else) has requested the reset of a password.
      Please click the link below to verify your identity and set a new password:

      ${resetUrl}

      If you did not request this, please ignore this email and your password will remain unchanged.
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message
      });

      return sendSuccess(res, 'Password reset email sent successfully', null);
    } catch (err) {
      // If email fails, clear the token fields
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      throw new Error('Email could not be sent. Please try again later.');
    }
  } catch (error) {
    next(error);
  }
};

// ✅ NEW: Reset Password (Updates DB)
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params; // Get token from URL params

    // Production-grade input validation
    if (!password) {
      throw new ValidationError('Password is required');
    }

    if (typeof password !== 'string') {
      throw new ValidationError('Password must be a string');
    }

    if (!password.trim()) {
      throw new ValidationError('Password cannot be empty or contain only whitespace');
    }

    // Validate token parameter
    if (!token || typeof token !== 'string' || !token.trim()) {
      throw new ValidationError('Invalid reset token');
    }

    // 1. Hash the incoming token to check against the DB
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token.trim())
      .digest('hex');

    // 2. Find user with matching token AND valid expiration
    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { [Op.gt]: Date.now() } // Check if expires > now
      }
    });

    if (!user) {
      throw new ValidationError('Invalid Token or Token has expired');
    }

    // 3. Validate New Password Strength
    if (!validatePassword(password)) {
      throw new ValidationError(
        'Password must be at least 8 characters long, contain at least 1 uppercase letter, and 1 number.'
      );
    }

    // 4. Update Password and Clear Token
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    // 5. Send new token (Login immediately)
    return sendSuccess(res, 'Password updated successfully', {
      token: generateToken(user.id, user.role)
    });
  } catch (error) {
    next(error);
  }
};