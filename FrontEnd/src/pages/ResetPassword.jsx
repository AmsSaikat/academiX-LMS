import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // VERIFY TOKEN ON LOAD
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(
          `http://localhost:5000/api/auth/verify-reset-token/${token}`
        );
        setValid(true);
      } catch (err) {
        toast.error("Invalid or expired password reset link");
        setValid(false);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();

    // Auto-focus on new password input
    const timer = setTimeout(() => {
      document.getElementById("new-password")?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [token]);

  // SUBMIT NEW PASSWORD
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password: data.password }
      );

      toast.success(res.data.message || "Password reset successful");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <h2 className="text-center mt-10 text-gray-600">Verifying link...</h2>
    );
  }

  // INVALID TOKEN
  if (!valid) {
    return (
      <h2 className="text-center mt-10 text-red-500">
        Invalid or expired reset link
      </h2>
    );
  }

  // VALID TOKEN → SHOW RESET FORM
  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-gray-100 rounded-xl shadow-lg relative">
      <h1 className="text-2xl mb-4 font-bold text-center">
        Reset Your Password
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* PASSWORD FIELD */}
        <div className="relative">
          <label className="block mb-1 font-semibold">New Password</label>
          <input
            id="new-password"
            type={showPass ? "text" : "password"}
            className="border w-full px-3 py-2 rounded-md"
            placeholder="Enter new password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          <div
            onClick={() => setShowPass((prev) => !prev)}
            className="absolute right-3 top-10 cursor-pointer text-gray-600"
          >
            {showPass ? <FaRegEyeSlash /> : <IoEyeOutline />}
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="block mb-1 font-semibold">Confirm Password</label>
          <input
            type={showPass ? "text" : "password"}
            className="border w-full px-3 py-2 rounded-md"
            placeholder="Confirm new password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded-md mt-3 transition ${
            submitting
              ? "bg-gray-400 cursor-not-allowed text-gray-200"
              : "bg-black hover:bg-gray-900 text-white"
          }`}
        >
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
