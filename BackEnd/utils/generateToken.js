import crypto from "crypto";
import jwt from "jsonwebtoken";

export const generateVerificationToken = () => {
  const verificationToken = crypto.randomBytes(20).toString("hex");
  const expiry = Date.now() + 1000 * 60 * 15; // 15 min expiry
  return { verificationToken, expiry };
};

export const generateCookieToken = (user) => {
  try {
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role || "user",  // FIXED fallback
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return token;
  } catch (error) {
    console.error("GenToken error:", error.message);
    return null; // FIXED
  }
};
