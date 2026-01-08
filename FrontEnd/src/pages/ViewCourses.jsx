import React, { useEffect, useState } from "react";
import { FaArrowLeftLong, FaStar } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

import { serverUrl } from "./config/config";
import Card from "../components/Card";

export default function ViewCourses() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const currentUser = useSelector((state) => state.user);

  const [course, setCourse] = useState(null);
  const [creator, setCreator] = useState(null);
  const [otherCourses, setOtherCourses] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loadingEnroll, setLoadingEnroll] = useState(false);

  // ===============================
  // FETCH COURSE
  // ===============================
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, {
          withCredentials: true,
        });
        setCourse(res.data);

        // ✅ Check enrollment for students
        if (
          currentUser?.role === "student" &&
          res.data.enrolledStudents.includes(currentUser._id)
        ) {
          setIsEnrolled(true);
        } else {
          setIsEnrolled(false);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };
    fetchCourse();
  }, [courseId, currentUser]);

  // ===============================
  // FETCH CREATOR INFO
  // ===============================
  useEffect(() => {
    const fetchCreator = async () => {
      if (!course?.creator) return;
      try {
        const res = await axios.post(
          `${serverUrl}/api/course/creator`,
          { userId: course.creator },
          { withCredentials: true }
        );
        setCreator(res.data);
      } catch (err) {
        console.error("Error fetching creator:", err);
      }
    };
    fetchCreator();
  }, [course]);

  // ===============================
  // FETCH OTHER COURSES BY CREATOR
  // ===============================
  useEffect(() => {
    const fetchOtherCourses = async () => {
      if (!creator?._id) return;
      try {
        const res = await axios.get(`${serverUrl}/api/course/getcreator`, {
          withCredentials: true,
        });
        const courses = res.data.filter((c) => c._id !== courseId);
        setOtherCourses(courses);
      } catch (err) {
        console.error("Error fetching other courses:", err);
      }
    };
    fetchOtherCourses();
  }, [creator, courseId]);

  // ===============================
  // ENROLL HANDLER (students only)
  // ===============================
  const handleEnroll = async () => {
    if (!currentUser) {
      alert("Please login first.");
      return;
    }

    if (isEnrolled) {
      navigate(`/viewlecture/${course._id}`);
      return;
    }

    try {
      setLoadingEnroll(true);
      const res = await axios.post(
        `${serverUrl}/api/course/enroll/${course._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsEnrolled(true);
        navigate(`/viewlecture/${course._id}`);
      }
    } catch (err) {
      console.error(err.response?.data || err);

      // ✅ Graceful fallback if backend says "Already enrolled"
      if (err.response?.data?.message === "Already enrolled") {
        setIsEnrolled(true);
        navigate(`/viewlecture/${course._id}`);
      } else {
        alert(err.response?.data?.message || "Enrollment failed");
      }
    } finally {
      setLoadingEnroll(false);
    }
  };

  if (!course) return <div className="p-6">Loading course...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">

        {/* BACK BUTTON */}
        <FaArrowLeftLong
          className="absolute top-3 left-4 w-6 h-6 cursor-pointer"
          onClick={() => navigate("/all-courses")}
        />

        {/* COURSE HEADER */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="rounded-xl w-full object-cover"
              />
            ) : (
              <div className="w-full h-60 bg-gray-200 rounded-xl" />
            )}
          </div>

          <div className="flex-1 space-y-2 mt-5">
            <h2 className="text-2xl font-bold">{course.title}</h2>
            <p className="text-gray-600">{course.subTitle}</p>

            <div className="flex flex-col gap-1">
              <div className="flex gap-2 text-yellow-500 font-medium">
                <FaStar /> 5
                <span className="text-gray-400">(1,200 Reviews)</span>
              </div>

              <div>
                <span className="text-xl font-semibold">${course.price}</span>
                <span className="line-through text-sm text-gray-400 ml-2">$599</span>
              </div>
            </div>

            <ul className="text-sm text-gray-700 space-y-1 pt-2">
              <li>✅ {course.lectures?.length || 0} Lectures</li>
              <li>✅ Lifetime access to course materials</li>
            </ul>

            {/* ✅ Role-based Button */}
            {currentUser?.role === "teacher" ? (
              course.creator === currentUser._id ? (
                <button
                  onClick={() => navigate(`/viewlecture/${course._id}`)}
                  className="px-6 py-2 rounded text-white bg-black hover:bg-gray-800"
                >
                  See Course
                </button>
              ) : (
                <p className="text-gray-500 italic">
                  Only the creator can view this course.
                </p>
              )
            ) : (
              <button
                onClick={handleEnroll}
                disabled={loadingEnroll}
                className={`px-6 py-2 rounded text-white ${
                  loadingEnroll
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {loadingEnroll
                  ? "Enrolling..."
                  : isEnrolled
                  ? "See Course"
                  : "Enroll"}
              </button>
            )}
          </div>
        </div>

        {/* CREATOR INFO */}
        {creator && (
          <div className="flex items-center gap-4 pt-4 border-t">
            {creator.photoUrl && (
              <img
                src={creator.photoUrl}
                alt={creator.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="font-semibold">{creator.name}</h2>
              <p className="text-sm text-gray-600">{creator.email}</p>
              <p className="text-sm text-gray-600">{creator.description}</p>
            </div>
          </div>
        )}

        {/* OTHER COURSES */}
        {otherCourses.length > 0 && (
          <div>
            <p className="text-xl font-semibold mb-3">
              Other Published Courses by the Same Educator
            </p>
            <div className="flex flex-wrap gap-6">
              {otherCourses.map((course) => (
                <Card
                  key={course._id}
                  id={course._id}
                  thumbnail={course.thumbnail}
                  price={course.price}
                  title={course.title}
                  category={course.category}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}