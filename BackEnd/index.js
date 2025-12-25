import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";   // FIX 1
import authRoute from "./route/authRoute.js";
import userRoute from "./route/userRoute.js";
import courseRouter from "./route/courseRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());                    // FIX 1 (required)

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,                     // FIX 2 (required for cookies)
  })
);

// Connect Database
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Backend");
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/course", courseRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
