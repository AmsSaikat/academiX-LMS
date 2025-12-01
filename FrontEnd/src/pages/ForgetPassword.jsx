import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function ForgetPassword() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const emailChecker = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", data);

      toast.success(res.data.message || `Reset link sent to ${data.email}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="max-w-md w-full mx-auto bg-gray-200 
        bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl p-8 mt-20">

        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text 
          bg-linear-to-br from-green-400 to-emerald-500 text-center">
          Forgot your password?
        </h1>

        <p className='text-center text-green-700'>
          Enter your email so that we can send you a password reset link
        </p>

        <form onSubmit={handleSubmit(emailChecker)}>
          <label>Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="border w-full h-[40px] border-gray-300 
              rounded-md text-[15px] px-3 focus:ring-2 
              focus:ring-blue-500 focus:outline-none transition"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md mt-3 hover:bg-gray-900 transition"
          >
            Send Link
          </button>
        </form>

      </div>
    </>
  );
}
