import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import HeroLogos from "../components/HeroLogos";
import ExploreCourses from "./ExploreCourses";
import CardPage from "../components/CardPage";
import About from "../components/About";

export default function Home() {
  const { userData: user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="bg-gray-50 pt-20">
        {/* =======================
            LOGGED-IN USER VIEW
        ======================= */}
        {user ? (
          <>
            {/* EMAIL VERIFICATION BANNER */}
            {!user.isEmailVerified && (
              <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-yellow-800">
                  <p className="font-semibold">Email not verified</p>
                  <p className="text-sm">
                    Verify your email to unlock all platform features.
                  </p>
                </div>
              </div>
            )}

            {/* HERO SECTION */}
            <section className="relative">
              <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                {/* TEXT */}
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                    Smart Learning Platform
                  </span>

                  <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                    Welcome back, {user.name || "Learner"} 👋
                  </h1>

                  <p className="mt-4 text-gray-600 text-lg">
                    Continue learning, track your progress, and unlock
                    new skills tailored to your journey.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <button
                      onClick={() => navigate("/all-courses")}
                      className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-900 transition"
                    >
                      Explore Courses
                    </button>

                    <button
                      onClick={() => navigate("/dashboard")}
                      className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Go to Dashboard
                    </button>
                  </div>

                  <p className="mt-4 text-sm text-gray-500">
                    Role: <span className="capitalize font-medium">{user.role}</span>
                  </p>
                </div>

                {/* IMAGE */}
                <div className="relative">
                  <img
                    src="/home.jpg"
                    alt="Learning"
                    className="rounded-2xl shadow-xl object-cover"
                  />
                </div>
              </div>
            </section>

            {/* TRUST LOGOS */}
            <section className="mt-16">
              <div className="max-w-6xl mx-auto px-4">
                <HeroLogos />
              </div>
            </section>

            {/* AI SEARCH (PLACEHOLDER – FUTURE READY) */}
            <section className="mt-16">
              <div className="max-w-3xl mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Find the perfect course with AI
                </h2>
                <p className="text-gray-600 mt-2">
                  Describe what you want to learn and let AI guide you.
                </p>

                <div className="relative mt-6">
                  <input
                    type="text"
                    placeholder="e.g. Learn React from scratch"
                    className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <img
                    src="/searchAi2.png"
                    alt="AI Search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 opacity-70"
                  />
                </div>
              </div>
            </section>

            {/* COURSE SECTIONS */}
            <section className="mt-20">
              <div className="max-w-6xl mx-auto px-4 space-y-12">
                <ExploreCourses />
                <CardPage />
              </div>
            </section>
          </>
        ) : (
          /* =======================
              GUEST VIEW
          ======================= */
          <section className="min-h-[80vh] flex items-center">
            <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
              {/* TEXT */}
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                  Learn. Build. Grow.
                </h1>

                <p className="mt-4 text-gray-600 text-lg">
                  A modern learning platform to upskill, teach,
                  and grow your career.
                </p>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-900 transition"
                  >
                    Get Started
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                  >
                    Login
                  </button>
                </div>
              </div>

              {/* IMAGE */}
              <div>
                <img
                  src="/home.jpg"
                  alt="Platform Preview"
                  className="rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </section>
        )}

        {/* ABOUT */}
        <section className="mt-24">
          <About />
        </section>
      </main>
    </>
  );
}
