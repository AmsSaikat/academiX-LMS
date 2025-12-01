import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export default function ResetPassword() {
  const { token } = useParams();
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);

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
  }, [token]);

  // SUBMIT NEW PASSWORD
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`, // token in params
        { password: data.password }
      );

      toast.success(res.data.message || "Password reset successful");
      window.location.href = "/login";
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
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
    <div className="max-w-md mx-auto mt-20 p-8 bg-gray-100 rounded-xl shadow-lg">
      <h1 className="text-2xl mb-4 font-bold text-center">
        Reset Your Password
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* PASSWORD FIELD */}
        <label className="block mb-1 font-semibold">New Password</label>
        <input
          type="password"
          className="border w-full px-3 py-2 rounded-md mb-1"
          placeholder="Enter new password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">
            {errors.password.message}
          </p>
        )}

        {/* CONFIRM PASSWORD */}
        <label className="block mb-1 font-semibold">Confirm Password</label>
        <input
          type="password"
          className="border w-full px-3 py-2 rounded-md mb-1"
          placeholder="Confirm new password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded-md mt-3 hover:bg-gray-900 transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
