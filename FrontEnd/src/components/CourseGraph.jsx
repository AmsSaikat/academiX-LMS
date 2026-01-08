import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CourseGraph = () => {
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseAnalytics = async () => {
      try {
        // Replace with your backend endpoint
        const res = await axios.get("http://localhost:5000/api/course/admin/analytics", {
          withCredentials: true, // if using cookies for auth
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust if using token
          },
        });

        // Transform backend data to Recharts-friendly format
        const chartData = res.data.map(course => ({
          title: course.title,
          lectureCount: course.lectureCount,
          enrolledCount: course.enrolledCount,
        }));

        setCourseData(chartData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course analytics:", error);
        setLoading(false);
      }
    };

    fetchCourseAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2 className="text-xl font-semibold mb-4">Your Courses: Lectures vs Enrolled Students</h2>
      <ResponsiveContainer>
        <BarChart
          data={courseData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="lectureCount" fill="#8884d8" name="Lectures" />
          <Bar dataKey="enrolledCount" fill="#82ca9d" name="Enrolled Students" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CourseGraph;
