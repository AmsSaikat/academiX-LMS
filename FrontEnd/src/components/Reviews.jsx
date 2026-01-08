// components/CourseReviews.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

export default function CourseReviews({ courseId, topCount = 5 }) {
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/course/${courseId}`, {
        withCredentials: true,
      });
      setReviews(res.data);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  };

  // Fetch logged-in user's review
  const fetchMyReview = async () => {
    try {
      const res = await axios.get(`/api/reviews/course/${courseId}/my-review`, {
        withCredentials: true,
      });
      if (res.data) {
        setMyReview(res.data);
        setRating(res.data.rating);
        setComment(res.data.comment || "");
      }
    } catch (err) {
      console.error("Fetch my review error:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchMyReview();
  }, [courseId]);

  // Submit or update review
  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) return alert("Please select a rating 1–5");
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/reviews/course/${courseId}`,
        { rating, comment },
        { withCredentials: true }
      );
      setMyReview(res.data.review);
      fetchReviews();
    } catch (err) {
      console.error("Submit review error:", err);
      alert("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  // Delete review
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    setLoading(true);
    try {
      await axios.delete(`/api/reviews/course/${courseId}`, { withCredentials: true });
      setMyReview(null);
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (err) {
      console.error("Delete review error:", err);
      alert("Error deleting review");
    } finally {
      setLoading(false);
    }
  };

  // Decide reviews to show
  const displayedReviews = showAll ? reviews : reviews.slice(0, topCount);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
      {/* Add/Update Review */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Review</h2>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;
            return (
              <FaStar
                key={i}
                className={`cursor-pointer ${
                  (hoverRating || rating) >= starValue ? "text-yellow-500" : "text-gray-300"
                }`}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(starValue)}
                size={24}
              />
            );
          })}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full border rounded-md p-2 mb-2"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {myReview ? "Update Review" : "Submit Review"}
          </button>
          {myReview && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <>
            <div className="space-y-4">
              {displayedReviews.map((r) => (
                <div
                  key={r._id}
                  className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div>
                    <p className="font-semibold">{r.user?.name || "Anonymous"}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < r.rating ? "text-yellow-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{r.comment}</p>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Show all / collapse button */}
            {reviews.length > topCount && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-blue-600 hover:underline mt-2"
              >
                {showAll ? "Show Less" : `View All Reviews (${reviews.length})`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
