import React from 'react'
import { FaYoutube, FaFacebook, FaGoogle } from "react-icons/fa";

export default function SocialNavs({ onGoogleClick, googleLoading }) {
  return (
    <div className="grid grid-flow-col gap-4 text-2xl justify-center mt-3">

      {/* GOOGLE */}
      <button
        type="button"
        onClick={googleLoading ? null : onGoogleClick}
        className={`transition ${googleLoading ? "opacity-60 cursor-not-allowed" : "hover:text-red-300"}`}
      >
        {googleLoading ? (
          <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full"></div>
        ) : (
          <FaGoogle />
        )}
      </button>

      <button type="button" className="hover:text-red-600 transition">
        <FaYoutube />
      </button>

      <button type="button" className="hover:text-blue-600 transition">
        <FaFacebook />
      </button>
    </div>
  );
}

