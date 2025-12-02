import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import SocialNavs from "../components/SocialNavs";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";

export default function SignUp() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ mode: "onBlur" });

  const [showPass, setShowPass] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handlePass = () => setShowPass(prev => !prev);

  // Normal Signup
  const signupHandler = async (data) => {
    try {
      const userData = {
        ...data,
        role: data.role.toLowerCase(),
      };

      const res = await axios.post("http://localhost:5000/api/auth/signup", userData);
      toast.success(res.data.message || "Signup successful");

      localStorage.setItem("user", JSON.stringify(res.data.user));

      reset();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  // Google Signup
  const googleSignUp = async () => {
    try {
      setGoogleLoading(true);

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Get Firebase ID Token (IMPORTANT)
      const token = await firebaseUser.getIdToken();

      // Send to backend
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token,
      });

      toast.success("Google login successful!");

      // Save returned user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (error) {
      toast.error("Google login failed");
      console.log(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="bg-[#f3f4f6] w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden w-[90%] md:w-[900px] max-w-[900px]">

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <form onSubmit={handleSubmit(signupHandler)} className="space-y-5">

            <fieldset className="border border-gray-300 rounded-lg p-6 space-y-4">
              <legend className="font-semibold text-2xl text-center">Let’s get started</legend>
              <p className="text-gray-500 text-center">Create your account</p>

              {/* Name */}
              <label className="block">
                <span className="font-medium">Name</span>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="border w-full h-[40px] border-gray-300 rounded-md px-3"
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </label>

              {/* Email */}
              <label className="block">
                <span className="font-medium">Email</span>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="border w-full h-[40px] border-gray-300 rounded-md px-3"
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </label>

              {/* Password */}
              <label className="block relative">
                <span className="font-medium">Password</span>
                <input
                  type={showPass ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                  className="border w-full h-[40px] border-gray-300 rounded-md px-3 pr-10"
                />
                <div
                  onClick={handlePass}
                  className="absolute right-3 top-[38px] cursor-pointer"
                >
                  {showPass ? <FaRegEyeSlash /> : <IoEyeOutline />}
                </div>
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
              </label>

              {/* Role */}
              <label className="block">
                <span className="font-medium">Role</span>
                <select
                  {...register("role", { required: "Role is required" })}
                  className="border w-full h-[40px] border-gray-300 rounded-md px-3"
                  defaultValue=""
                >
                  <option value="" disabled hidden>Select your role</option>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
                {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
              </label>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900"
              >
                Sign Up
              </button>

            </fieldset>

            <p className="text-center text-gray-500 mt-3">Or continue with</p>

            <SocialNavs
              onGoogleClick={googleSignUp}
              googleLoading={googleLoading}
            />

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-pink-500 underline">Login</Link>
            </p>
          </form>
        </div>

        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex-col justify-center items-center p-10 text-center space-y-4">
          <img src="/logo.jpg" alt="logo" className="w-28 mb-3 rounded-full shadow-lg" />
          <h2 className="text-3xl font-bold">Welcome to LMS</h2>
          <p className="text-gray-300 text-[15px]">Create an account to access personalized courses and content.</p>
        </div>

      </div>
    </div>
  );
}
