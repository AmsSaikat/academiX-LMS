import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  addOrUpdateReview,
  getCourseReviews,
  getMyReview,
  deleteReview,
  getAllReviewsAdmin,
} from "../controller/reviewController.js";

const reviewRouter = express.Router();

// ➕ Add or update review
reviewRouter.post("/course/:courseId", isAuth, addOrUpdateReview);

// 📄 Get all reviews of a course (public)
reviewRouter.get("/course/:courseId", getCourseReviews);

// 👤 Get logged-in user's review
reviewRouter.get("/course/:courseId/my-review", isAuth, getMyReview);

// ❌ Delete logged-in user's review
reviewRouter.delete("/course/:courseId", isAuth, deleteReview);

// 🛡️ Admin: get all reviews
reviewRouter.get("/admin/all", isAuth, (req, res, next) => {
  if (req.role !== "admin") return res.status(403).json({ message: "Admin access only" });
  next();
}, getAllReviewsAdmin);

export default reviewRouter;
