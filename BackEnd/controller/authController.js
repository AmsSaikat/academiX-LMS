import User from "../model/userModel.js";
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import validator from "validator";
import bcrypt from "bcryptjs";
import { sendTestMail } from "../config/mailer.js";
import { generateCookieToken, generateVerificationToken } from "../utils/generateToken.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import { setTokenCookie } from "../utils/setCookieToken.js";

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

    // Validate password length
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

    // Generate email verification token
    const { verificationToken, expiry } = generateVerificationToken();
    newUser.verificationToken = verificationToken;
    newUser.verificationTokenExpiry = expiry;

    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Generate login token (JWT)
    const token = generateCookieToken(newUser);

    // Set cookie for instant login
    setTokenCookie(res, token);

    return res.status(201).json({
      message: "User created successfully. Verification email sent.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);
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

    // Email verified check
    if (!user.isEmailVerified) {
      return res.status(400).json({ message: "Email is yet to be verified" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Generate login token (JWT)
    const token = generateCookieToken(user);

    // Set cookie for instant login
    setTokenCookie(res, token);

    // Response
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};



// ---------------------- LOGOUT ----------------------
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // set true in production (HTTPS)
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
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



// ---------------------- GOOGLE-AUTHENTICATION  ----------------------
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



// ---------------------- EMAIL-VERIFICATION  ----------------------
export const verifyEmail = async (req, res) => {
  try {
    // Extract code from body
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Verification code is required" });
    }

    // Find user with matching verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    // Check token expiration
    if (user.verificationTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Expired token" });
    }

    // Update verification status
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;

    await user.save();

    // Successful response
    res.status(200).json({
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.isEmailVerified,
      },
    });

  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// ---------------------- RESEND VERIFICATION EMAIL ----------------------
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new token
    const {verificationToken,expiry} = await generateVerificationToken();

    // Save token in DB (optional)
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = expiry
    await user.save();

    // Send email
    await sendVerificationEmail(email, verificationToken);

    return res.status(200).json({
      message: "Verification email resent successfully!",
    });

  } catch (error) {
    console.error("Resend email error:", error);
    return res.status(500).json({ message: "Failed to resend verification email" });
  }
};



