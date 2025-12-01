import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import cors from "cors";
import authRoute from "./route/authRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // parse JSON
app.use(
  cors({
    origin: process.env.CLIENT_URL, // frontend URL
  })
);

// Connect Database
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Backend");
});

// Auth routes
app.use("/api/auth", authRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
