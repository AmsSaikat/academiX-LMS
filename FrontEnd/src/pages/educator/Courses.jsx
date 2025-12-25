import React, { useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetCreatorCourse from "../../customHooks/getCreatorCourse";

export default function Courses() {
  const { creatorCourseData } = useSelector((state) => state.course);
  const {userData}=useSelector(state=>state.user)
  const navigate = useNavigate();
  
  useGetCreatorCourse()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-full min-h-screen p-4 sm:p-6 bg-gray-100 relative">
        
        {/* Back Button */}
        <FaArrowLeftLong
          className="absolute top-4 left-4 w-6 h-6 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h1 className="text-2xl font-semibold">All Created Courses</h1>
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            onClick={() => navigate("/createcourse")}
          >
            Create Course
          </button>
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Course</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {creatorCourseData?.map((course, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 flex items-center gap-4">
                    {course?.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt="Thumbnail"
                        className="w-24 h-14 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-24 h-14 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                    <span className="font-medium">{course?.title}</span>
                  </td>

                  <td className="py-3 px-4">
                    {course?.price ? `$${course.price}` : "$ NA"}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course?.isPublished
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {course?.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <FaEdit
                      className="text-gray-600 hover:text-blue-600 cursor-pointer"
                      onClick={() =>
                        navigate(`/editcourse/${course?._id}`)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {creatorCourseData?.length === 0 && (
            <p className="text-center text-sm text-gray-400 mt-6">
              No courses created yet.
            </p>
          )}
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden space-y-4">
          {creatorCourseData?.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-3"
            >
              <div className="flex gap-4 items-center">
                {course?.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt="Thumbnail"
                    className="w-16 h-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}

                <div className="flex-1">
                  <h2 className="font-medium text-sm line-clamp-2">
                    {course?.title}
                  </h2>
                  <p className="text-gray-600 text-xs mt-1">
                    {course?.price ? `$${course.price}` : "$ NA"}
                  </p>
                </div>

                <FaEdit
                  className="text-gray-600 hover:text-blue-600 cursor-pointer"
                  onClick={() =>
                    navigate(`/editcourse/${course?._id}`)
                  }
                />
              </div>

              <span
                className={`w-fit px-3 py-1 text-xs rounded-full font-medium ${
                  course?.isPublished
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {course?.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          ))}

          {creatorCourseData?.length === 0 && (
            <p className="text-center text-sm text-gray-400 mt-4">
              No courses created yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
