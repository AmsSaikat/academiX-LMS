import express from "express";
import {forgotPassword,googleAuth,login,logout,mailTester,resendVerificationEmail
    ,resetPassword,signup,verifyEmail,verifyResetToken,
} from "../controller/authController.js";

import isAuth from "../middleware/isAuth.js";

const authRoute = express.Router();

// Public Routes
authRoute.post("/signup", signup);
authRoute.post("/login", login);
authRoute.post("/forgot-password", forgotPassword);
authRoute.get("/verify-reset-token/:token", verifyResetToken);
authRoute.post("/reset-password/:token", resetPassword);
authRoute.get("/verify-email/:token", verifyEmail);
authRoute.post("/google", googleAuth);
authRoute.post("/resend-email", resendVerificationEmail);
authRoute.get("/test-email", mailTester);


// Protected Routes
authRoute.get("/logout", isAuth, logout);   // 🔒 protected


export default authRoute;
