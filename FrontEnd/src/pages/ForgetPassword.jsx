import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [sentMail, setSentMail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const emailChecker = async (data) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${serverUrl}/api/auth/forgot-password`,
        data,
        { withCredentials: true } // ensure cookie auth if needed
      );

      setSentMail(true);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {sentMail ? (
        <div className="max-w-md w-full mx-auto bg-green-100 p-6 rounded-xl mt-20 text-center">
          Kindly check your inbox. A password reset link has been sent.
        </div>
      ) : (
        <div className="max-w-md w-full mx-auto bg-gray-200 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl p-8 mt-20">

          <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-500 text-center">
            Forgot your password?
          </h1>

          <p className="text-center text-gray-700 mb-4">
            Enter your email so we can send you a password reset link.
          </p>

          <form onSubmit={handleSubmit(emailChecker)}>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="border w-full h-[40px] border-gray-300 rounded-md text-[15px] px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition mb-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md mt-3 hover:bg-gray-900 transition flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </div>
              ) : (
                "Send Link"
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
