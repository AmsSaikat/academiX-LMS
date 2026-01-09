import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Card from "./Card";
import useGetPublishedCourses from "../customHooks/getPublishedCourses";


export default function CardPage() {
  // Fetch courses using your hook
  useGetPublishedCourses();

  const { courseData } = useSelector((state) => state.course);
  const [popularCourses, setPopularCourses] = useState([]);

  // Get top 6 popular courses
  useEffect(() => {
    if (courseData) {
      setPopularCourses(courseData.slice(0, 6));
    }
  }, [courseData]);

  return (
    <div className="relative flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 mb-4">
        Our Popular Courses
      </h1>

      {/* Subtitle */}
      <p className="text-center text-gray-600 max-w-3xl mb-10">
        Explore top-rated courses designed to boost your skills, enhance your career, 
        and unlock opportunities in Tech, AI, and beyond.
      </p>

      {/* Courses Grid - max 3 per row, centered */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl justify-items-center">
        {popularCourses?.map((course) => (
          <Card
            key={course._id}
            thumbnail={course.thumbnail}
            title={course.title}
            category={course.category} // fixed spelling
            price={course.price}
            id={course._id}
            className="w-full max-w-sm"
          />
        ))}

        {/* Fallback */}
        {popularCourses?.length === 0 && (
          <p className="text-gray-500 col-span-full text-center mt-10">
            No courses available yet.
          </p>
        )}
      </div>
    </div>
  );
}
