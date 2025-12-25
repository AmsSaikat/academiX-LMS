import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

export default function MyProfile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full relative">
        {/* Back Button */}
        <FaArrowLeftLong
          className="absolute top-[8%] left-[5%] w-[22px] h-[22px] cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Profile Picture */}
        <div className="flex flex-col items-center text-center">
          {userData?.photoUrl ? (
            <img
              src={userData.photoUrl}
              className="w-24 h-24 rounded-full object-cover border-4 border-black"
              alt="Profile"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-400 text-white flex items-center justify-center text-[30px] border-2 border-black">
              {userData?.name?.slice(0, 1)?.toUpperCase()}
            </div>
          )}

          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            {userData?.name || "User"}
          </h2>
          <p className="text-sm text-gray-500 capitalize">
            {userData?.role || "Role"}
          </p>
        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-4">
          <div className="text-sm flex items-center justify-start gap-1">
            <span className="font-semibold text-gray-700">
              Email: {userData?.email || "Not available"}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">
              Bio: {userData?.description || "No bio set"}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">
              Enrolled courses: {userData?.enrollCourses?.length || 0}
            </span>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
          className="mt-6 px-5 py-2 rounded bg-black text-white active:bg-[#4b4b4b] cursor-pointer transition"
          onClick={() => navigate("/edit-profile")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
