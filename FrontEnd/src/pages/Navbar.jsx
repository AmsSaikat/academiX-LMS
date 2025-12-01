import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import toast from "react-hot-toast";
import axios from "axios";
import { FiMenu, FiX } from "react-icons/fi"; // Hamburger icons
import { LiaBackspaceSolid } from "react-icons/lia"; // Cross icon for profile close

export default function Navbar() {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu toggle
  const dropdownRef = useRef(null);

  const profileToggler = () => setShowProfile((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Get userData from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout");

      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar bg-gray-200 shadow-md px-4 md:px-8 relative">
      {/* LEFT SIDE: Logo */}
      <div className="flex items-center gap-2">
        <img src="/LMS.jpg" alt="LMS Logo" className="w-10 h-10 rounded-full" />
        <h1 className="font-bold text-lg text-gray-800">LMS</h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="ml-auto flex items-center">
        {/* Hamburger for mobile */}
        <div className="md:hidden">
          {menuOpen ? (
            <FiX onClick={toggleMenu} className="text-2xl cursor-pointer text-gray-800" />
          ) : (
            <FiMenu onClick={toggleMenu} className="text-2xl cursor-pointer text-gray-800" />
          )}
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          {userData ? (
            <>
              {/* Profile dropdown */}
              <div ref={dropdownRef} className="relative">
                <div onClick={profileToggler} className="flex items-center gap-2 cursor-pointer">
                  <CgProfile className="text-2xl text-gray-700" />
                  <span className="text-gray-800 font-medium">
                    {userData?.name || "User"}
                  </span>
                  {showProfile && (
                    <LiaBackspaceSolid
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProfile(false);
                      }}
                      className="text-xl text-gray-600 hover:text-red-600 transition cursor-pointer"
                    />
                  )}
                </div>

                {showProfile && (
                  <div className="absolute top-[120%] right-0 flex flex-col gap-2 border rounded-lg p-2 bg-white shadow-md z-10 w-40">
                    <span className="text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                      My Profile
                    </span>
                    <span className="text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                      My Courses
                    </span>
                  </div>
                )}
              </div>

              {/* Dashboard (only for teachers) */}
              {userData.role === "teacher" && (
                <Link
                  to="/dashboard"
                  className="border px-3 py-1.5 rounded-md bg-black text-gray-200 hover:bg-gray-900 transition"
                >
                  Dashboard
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="border px-3 py-1.5 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="border px-3 py-1.5 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-800 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="border px-3 py-1.5 rounded-md bg-black text-gray-200 hover:bg-gray-900 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="absolute top-14 right-0 w-full bg-gray-100 shadow-lg flex flex-col items-center py-4 gap-3 md:hidden z-20">
          {userData ? (
            <>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <CgProfile className="text-3xl text-gray-700" />
                  <span className="text-gray-800 font-medium">{userData?.username || "User"}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 mt-2">
                <span className="text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-200 cursor-pointer">
                  My Profile
                </span>
                <span className="text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-200 cursor-pointer">
                  My Courses
                </span>
              </div>

              {userData.role === "teacher" && (
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="border px-3 py-1.5 rounded-md bg-black text-gray-200 hover:bg-gray-900 transition w-32 text-center"
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="border px-3 py-1.5 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-800 transition w-32"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="border px-3 py-1.5 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-800 transition w-32 text-center"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="border px-3 py-1.5 rounded-md bg-black text-gray-200 hover:bg-gray-900 transition w-32 text-center"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
