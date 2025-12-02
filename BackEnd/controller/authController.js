import User from "../model/userModel.js";
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import validator from "validator";
import bcrypt from "bcryptjs";
import { sendTestMail } from "../config/mailer.js";

// ---------------------- SIGNUP ----------------------
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email" });
    }

    // Check if user exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check password length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    // Return success
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name:newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: `Signup error: ${error.message}` });
  }
};

// ---------------------- LOGIN ----------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Return success (no token, no cookies)
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};



// ---------------------- LOGOUT ----------------------
export const logout = async (req, res) => {
  // Logout is just a frontend action (remove user from localStorage)
  return res.status(200).json({ message: "Logout successful" });
};




// ---------------------- FORGOT-PASSWORD ----------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    // Create secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save hashed token in DB
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    // Reset URL (pointing to frontend)
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // Gmail App Password
      },
    });

    // Email Template
    await transporter.sendMail({
      from: `"My App" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetURL}" 
           style="display:inline-block;margin-top:10px;background:#007bff;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;"
           target="_blank">
          Reset Password
        </a>
        <p style="margin-top:15px;">Or copy this link:</p>
        <p>${resetURL}</p>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    return res.status(200).json({
      message: "Password reset link sent to email",
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// ---------------------- VERIFY-RESET-TOKEN ----------------------
export const verifyResetToken = async (req, res) => {
  try {
    const token = req.params.token;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    return res.status(200).json({ message: "Token valid" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




// ---------------------- RESET-PASSWORD ----------------------
export const resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update password
    user.password = await bcrypt.hash(password, 10);

    // Clear token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// ---------------------- MAIL-TESTING  ----------------------
export const mailTester = async (req, res) => {
  try {
    sendTestMail(); // no need to await, it's not async
    return res.status(200).json({ message: "Test email sent (check console)" });
  } catch (error) {
    console.log("Mail Test Error:", error);
    return res.status(500).json({ message: "Failed to send test email" });
  }
};




export const googleAuth = async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;

    console.log("Google user:", name, email);

    return res.status(200).json({
      success: true,
      message: "Google sign-in successful",
      user: { name, email, photoURL },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
