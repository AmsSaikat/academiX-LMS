import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import HeroLogos from "../components/HeroLogos";
import ExploreCourses from "./ExploreCourses";
import CardPage from "../components/CardPage";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { userData: user } = useSelector((state) => state.user);
  const navigate=useNavigate()

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 pt-20">
        {user ? (
          <>
            {/* Email Not Verified Banner */}
            {!user.isEmailVerified && (
              <div className="w-full max-w-3xl bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl mb-6 shadow-sm">
                <strong className="font-semibold">Email not verified!</strong>
                <p className="text-sm">
                  Please check your inbox to verify your email and unlock full access.
                </p>
              </div>
            )}

            {/* FULLSCREEN HERO SECTION */}
            <div className="relative w-full h-screen rounded-2xl overflow-hidden shadow-lg">
              <img src="/home.jpg" alt="Home" className="w-full h-full object-cover" />
              <div className="absolute top-10 left-0 w-full text-center text-white px-4">
                <span className="text-pink-300 font-semibold tracking-wide uppercase">
                  Take your skills to the next level
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold mt-2 drop-shadow-lg">
                  Welcome, {user.name || user.email} 👋
                </h1>
                <p className="text-gray-200 mt-2 text-lg drop-shadow-lg">
                  Role: <span className="font-medium capitalize">{user.role}</span>
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-10 text-center">
              <h2 className="text-2xl font-semibold">Continue Your Learning Journey</h2>
              <p className="text-gray-500 mt-1">
                Access courses, track progress, and unlock new skills.
              </p>

              {/* Explore button */}
              <button className="mt-4 px-6 py-3 bg-black border-white text-white rounded-xl hover:bg-gray-900 transition-all flex items-center gap-2 mx-auto">
                Explore Courses
                <img src="/ai.png" alt="AI Icon" className="w-6 h-6" />
              </button>

              {/* AI Search */}
              <div className="relative mt-6 w-full max-w-xs mx-auto">
                <input
                  type="text"
                  placeholder="Search with AI"
                  className="w-full px-6 py-3 pr-12 bg-gray-500 text-gray-950 rounded-xl border border-black placeholder-gray-800 hover:bg-gray-900 transition-all"
                />
                <img
                  src="/searchAi2.png"
                  alt="Search Icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-7 h-7 opacity-80"
                />
              </div>

              <div className="mt-5 flex justify-between gap-4">
                <HeroLogos />
              </div>
              <div className="mt-5 flex justify-between gap-4">
                <ExploreCourses />
                <CardPage />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Guest View */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-center">
              Welcome to the LMS
            </h1>
            <p className="text-gray-600 mt-3 text-center text-lg max-w-xl">
              Learn, grow, and upskill with personalized courses and progress tracking.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="/login"
                className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-all"
              >
                Login
              </a>
              <a
                href="/signup"
                className="px-6 py-3 bg-gray-200 text-black rounded-xl hover:bg-gray-300 transition-all"
              >
                Sign Up
              </a>
            </div>

            <div className="mt-10">
              <img
                src="/home.jpg"
                alt="LMS"
                className="max-w-xl w-full rounded-2xl shadow-xl"
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
