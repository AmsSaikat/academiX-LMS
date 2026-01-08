import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaStar, FaPlayCircle } from "react-icons/fa";
import { serverUrl } from "./config/config";

export default function ViewLecture({ currentUser }) {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [topReviews, setTopReviews] = useState([]);
  const [newReview, setNewReview] = useState({ stars: 5, comment: "" });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  // ===============================
  // FETCH COURSE + LECTURES
  // ===============================
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, {
          withCredentials: true,
        });
        setCourse(res.data);
        setSelectedLecture(res.data.lectures[0]); // default first lecture
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };
    fetchCourse();
  }, [courseId]);

  // ===============================
  // FETCH REVIEWS
  // ===============================
  useEffect(() => {
    const fetchReviews = async () => {
      if (!course) return;
      try {
        setLoadingReviews(true);
        const res = await axios.get(`${serverUrl}/api/review/getcourse/${course._id}`, {
          withCredentials: true,
        });
        const sorted = (res.data?.reviews || []).sort((a, b) => b.stars - a.stars);
        setReviews(sorted);
        setTopReviews(sorted.slice(0, 5));
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
        setTopReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [course]);

  if (!course) return <div className="p-6">Loading course...</div>;

  // ===============================
  // REVIEW HANDLERS
  // ===============================
  const handleReviewSubmit = async () => {
    try {
      setSubmittingReview(true);
      if (editingReviewId) {
        await axios.put(
          `${serverUrl}/api/review/${editingReviewId}`,
          newReview,
          { withCredentials: true }
        );
        alert("Review updated!");
      } else {
        await axios.post(
          `${serverUrl}/api/review`,
          { ...newReview, courseId: course._id },
          { withCredentials: true }
        );
        alert("Review added!");
      }
      setNewReview({ stars: 5, comment: "" });
      setEditingReviewId(null);

      // Refresh reviews
      const res = await axios.get(`${serverUrl}/api/review/getcourse/${course._id}`, {
        withCredentials: true,
      });
      const sorted = (res.data?.reviews || []).sort((a, b) => b.stars - a.stars);
      setReviews(sorted);
      setTopReviews(sorted.slice(0, 5));
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setNewReview({ stars: review.stars, comment: review.comment });
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axios.delete(`${serverUrl}/api/review/${reviewId}`, { withCredentials: true });
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      setTopReviews(prev => prev.filter(r => r._id !== reviewId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete review.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">

        <h2 className="text-2xl font-bold">{course.title}</h2>
        <p className="text-gray-600">{course.subTitle}</p>

        {/* ==================== LECTURE LIST + VIDEO ==================== */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Lecture List */}
          <div className="w-full md:w-1/3 p-4 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-bold mb-2">Lectures</h3>
            <ul className="flex flex-col gap-2">
              {course.lectures?.map((lec) => (
                <li
                  key={lec._id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                    ${selectedLecture?._id === lec._id ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}
                  `}
                  onClick={() => setSelectedLecture(lec)}
                >
                  <FaPlayCircle className="text-yellow-500" />
                  {lec.lectureTitle}
                </li>
              ))}
            </ul>
          </div>

          {/* Video Player */}
          <div className="w-full md:w-2/3 p-4 rounded-2xl shadow-lg border">
            {selectedLecture?.videoUrl ? (
              <video
                src={selectedLecture.videoUrl}
                controls
                className="w-full h-[400px] object-cover rounded-lg"
              />
            ) : (
              <p>Select a lecture to watch</p>
            )}
          </div>
        </div>

        {/* ==================== TOP REVIEWS ==================== */}
        <div className="pt-6 border-t">
          <h3 className="text-xl font-bold mb-2">Top Reviews</h3>

          {loadingReviews ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : topReviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            topReviews.map(r => (
              <div key={r._id} className="p-3 border rounded mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{r.user?.name || "Anonymous"}</span>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
                <p>{r.comment}</p>
                {r.user?._id === currentUser?._id && (
                  <div className="flex gap-2 mt-1 text-sm">
                    <button onClick={() => handleEdit(r)} className="text-blue-500">Edit</button>
                    <button onClick={() => handleDelete(r._id)} className="text-red-500">Delete</button>
                  </div>
                )}
              </div>
            ))
          )}

          {reviews.length > 5 && (
            <button
              onClick={() => alert("Show all reviews modal/page")}
              className="text-blue-500 mt-2"
            >
              See All Reviews
            </button>
          )}
        </div>

        {/* ==================== ADD / EDIT REVIEW ==================== */}
        {currentUser?.role === "student" && course.enrolledStudents.includes(currentUser._id) && (
          <div className="pt-4 border-t">
            <h3 className="text-xl font-bold mb-2">
              {editingReviewId ? "Edit Your Review" : "Add a Review"}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span>Rating: </span>
              <select
                value={newReview.stars}
                onChange={e => setNewReview(prev => ({ ...prev, stars: Number(e.target.value) }))}
                className="border rounded p-1"
              >
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={3}
              placeholder="Write your review..."
              value={newReview.comment}
              onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            />
            <button
              onClick={handleReviewSubmit}
              disabled={submittingReview}
              className={`px-4 py-2 rounded text-white ${
                submittingReview ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
              }`}
            >
              {submittingReview
                ? "Submitting..."
                : editingReviewId
                ? "Update Review"
                : "Submit Review"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}