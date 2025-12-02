import express from"express"
import { forgotPassword, googleAuth, login, logout, mailTester, resetPassword, signup, verifyResetToken } from "../controller/authController.js"

const authRoute=express.Router()

authRoute.post("/signup", signup)
authRoute.post("/login", login)
authRoute.get("/logout", logout)
authRoute.post("/forgot-password", forgotPassword);
authRoute.get("/verify-reset-token/:token", verifyResetToken);
authRoute.post("/reset-password/:token", resetPassword);
authRoute.get("/test-email",mailTester)
authRoute.post("/google", googleAuth);


export default authRoute