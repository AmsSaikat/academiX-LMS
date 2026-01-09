import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetPublishedCourses from "../customHooks/getPublishedCourses";


export default function PopularCourses() {
  useGetPublishedCourses(); // 🔥 USING YOUR HOOK

  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);
  const currentUser = useSelector((state) => state.user.currentUser);

  const popularCourses = courseData?.slice(0, 5); // 3–5 courses

  const handleClick = (course) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const isEnrolled = course.enrolledStudents?.includes(
      currentUser._id
    );

    if (isEnrolled) {
      navigate(`/course/${course._id}/lectures`);
    } else {
      navigate(`/course/${course._id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {popularCourses?.map((course) => {
        const isEnrolled =
          currentUser &&
          course.enrolledStudents?.includes(currentUser._id);

        return (
          <div
            key={course._id}
            className="border rounded-xl p-4 shadow"
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-40 w-full object-cover rounded"
            />

            <h2 className="text-lg font-semibold mt-3">
              {course.title}
            </h2>

            <button
              onClick={() => handleClick(course)}
              className={`mt-4 w-full py-2 rounded text-white ${
                isEnrolled
                  ? "bg-green-600"
                  : "bg-blue-600"
              }`}
            >
              {isEnrolled ? "See Course" : "Enroll Now"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
