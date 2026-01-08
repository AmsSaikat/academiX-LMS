import Review from "../model/reviewModel.js";
import Course from "../model/courseModel.js";



export const addOrUpdateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { courseId } = req.params;
    const userId = req.user._id;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const review = await Review.findOneAndUpdate(
      { course: courseId, user: userId },
      { rating, comment },
      { new: true, upsert: true }
    );

    await updateCourseRating(courseId);

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};





export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ course: courseId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};



export const getMyReview = async (req, res) => {
  try {
    const { courseId } = req.params;

    const review = await Review.findOne({
      course: courseId,
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch review",
    });
  }
};




export const deleteReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === "admin";

    const review = await Review.findOne({
      course: courseId,
      ...(isAdmin ? {} : { user: userId }),
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await review.deleteOne();
    await updateCourseRating(courseId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};




export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};




const updateCourseRating = async (courseId) => {
  const stats = await Review.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: "$course",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: Number(stats[0].avgRating.toFixed(1)),
      numReviews: stats[0].totalReviews,
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: 0,
      numReviews: 0,
    });
  }
};

