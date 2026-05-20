const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate verification token
    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    // Hash token
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Save token in DB
    user.emailVerificationToken =
      hashedVerificationToken;

    // Expiry: 10 mins
    user.emailVerificationExpire =
      Date.now() + 10 * 60 * 1000;

    const verificationUrl =
      `http://localhost:5173/verify-email/${verificationToken}`;

    const message = `
Verify your email by clicking the link below:

${verificationUrl}

This link expires in 10 minutes.
`;

    await sendEmail({
      email: user.email,
      subject: "Email Verification",
      message,
    });

    await user.save();

    res.status(201).json({
      message:
        "Registration successful. Please verify your email.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    // Check email verification
    if (!user.isVerified) {
      return res.status(401).json({
        message:
          "Please verify your email before logging in",
      });
    }

    // Generate tokens
    const accessToken =
      generateAccessToken(user._id);

    const refreshToken =
      generateRefreshToken(user._id);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save hashed token
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Expiry: 10 mins
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Reset URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
You requested a password reset.

Click the link below to reset your password:

${resetUrl}

This link expires in 10 minutes.
`;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.status(200).json({
      message: "Reset email sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    // Hash incoming token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    // Check user
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // Get new password
    const { password } = req.body;

    // Hash new password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Save updated user
    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const verifyEmail = async (req, res) => {
  try {
    // Hash incoming token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: {
        $gt: Date.now(),
      },
    });

    // Check user exists
    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired verification token",
      });
    }

    // Verify account
    user.isVerified = true;

    // Clear token fields
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    // Save updated user
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
module.exports = {
  signupUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
