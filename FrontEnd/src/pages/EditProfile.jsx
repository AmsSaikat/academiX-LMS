import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserdata } from "../redux/userSlice";
import { toast } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

export default function EditProfile() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null); // actual file
  const [preview, setPreview] = useState(null); // preview URL
  const [loading, setLoading] = useState(false);

  // Initialize form values when userData loads
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setDescription(userData.description || "");
      setPreview(userData.photoUrl || null); // show current photo
    }
  }, [userData]);

  const handleEditProfile = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (photoFile) formData.append("photoUrl", photoFile);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/user/profile`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }, // ✅ important
        }
      );
      dispatch(setUserdata(res.data)); // Update Redux store
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Update Profile Error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative">
        <FaArrowLeftLong
          className="absolute top-4 left-4 w-6 h-6 cursor-pointer"
          onClick={() => navigate("/profile")}
        />

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Profile
        </h2>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Avatar preview */}
          <div className="flex flex-col items-center text-center mb-4">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-black"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-400 text-white flex items-center justify-center text-3xl border-2 border-black">
                {userData?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* File input */}
          <div className="mb-4">
            <label htmlFor="image" className="text-sm font-medium text-gray-700">
              Select Avatar
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-md text-sm"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPhotoFile(file);
                  setPreview(URL.createObjectURL(file)); // ✅ instant preview
                }
              }}
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="name"
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-md text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email (read-only) */}
          <div className="mb-4">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              placeholder={userData?.email || ""}
              readOnly
              className="w-full px-4 py-2 border rounded-md text-sm bg-gray-100"
            />
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Tell us about yourself"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Save button */}
          <button
            type="button"
            onClick={handleEditProfile}
            disabled={loading}
            className="w-full bg-black active:bg-[#454545] text-white py-2 rounded-md font-medium flex justify-center items-center"
          >
            {loading ? <ClipLoader size={24} color="white" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}