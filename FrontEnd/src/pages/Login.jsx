import React, { useState } from "react";
import SocialNavs from '../components/SocialNavs';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { setUserdata } from "../redux/userSlice";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handlePass = () => setShowPass((prev) => !prev);

  const loginChecker = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data,
        { withCredentials: true } // Important if using cookies
      );

      dispatch(setUserdata(res.data.user)); // Store user in Redux
      toast.success(res.data.message || "Login successful");
      reset();
      navigate("/"); // Redirect to homepage
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f3f4f6] w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden w-[90%] md:w-[800px] max-w-[900px]">
        {/* Left Section (Login Form) */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <form onSubmit={handleSubmit(loginChecker)} className="space-y-5">
            <fieldset className="border border-gray-300 rounded-lg p-6 space-y-4">
              <legend className="font-semibold text-2xl text-center">
                Welcome Back 👋
              </legend>
              <p className="text-[#999797] text-center">
                Login to continue your journey
              </p>

              {/* Email */}
              <label className="block">
                <span className="font-medium">Email</span>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="border w-full h-[40px] border-gray-300 rounded-md text-[15px] px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </label>

              {/* Password */}
              <label className="block relative">
                <span className="font-medium">Password</span>
                <input
                  type={showPass ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="border w-full h-[40px] border-gray-300 rounded-md text-[15px] px-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
                <div
                  onClick={handlePass}
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-600 text-lg"
                >
                  {showPass ? <FaRegEyeSlash /> : <IoEyeOutline />}
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded-md mt-3 hover:bg-gray-900 transition flex justify-center items-center"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  "Login"
                )}
              </button>

              <div>
                <p>
                  Forgot your{" "}
                  <span
                    className="underline text-red-400 cursor-pointer"
                    onClick={() => navigate("/forgot-password")}
                  >
                    password
                  </span>
                  ?
                </p>
              </div>
            </fieldset>
          </form>

          <p className="text-center text-gray-500 mt-3">Or continue with</p>
          <SocialNavs />
        </div>

        {/* Right Section (Register Prompt) */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex-col justify-center items-center p-10 text-center space-y-4">
          <img
            src="/logo.jpg"
            alt="logo"
            className="w-28 mb-3 shadow-lg rounded-full"
          />
          <h2 className="text-3xl font-bold">New Here?</h2>
          <p className="text-gray-300 text-[15px]">
            Create an account to access personalized courses and content.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="mt-3 px-6 py-2 border border-white rounded-md hover:bg-white hover:text-black transition font-medium"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
