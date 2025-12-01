import React from "react";
import Navbar from "./Navbar";

export default function Home() {
  // ✅ Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        {user ? (
          <>
            <h1 className="text-3xl font-bold">Welcome, {user.name || user.email} 👋</h1>
            <p className="text-gray-600 mt-2">Role: {user.role}</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Welcome to the LMS</h1>
            <p className="text-gray-600 mt-2">
              Please <a href="/login" className="text-blue-500 underline">Login</a> or{" "}
              <a href="/signup" className="text-blue-500 underline">Sign Up</a>.
            </p>
          </>
        )}
      </div>
    </>
  );
}
