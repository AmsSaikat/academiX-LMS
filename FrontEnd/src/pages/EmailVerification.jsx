import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import useGetCurrentUser from "../customHooks/getCurrentUser"; // your custom hook

export default function EmailVerification() {
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  // Fetch current user on component mount
  useGetCurrentUser();

  const resendEmail = async () => {
    if (!userData?.email) return toast.error("Please login again");

    try {
      setLoading(true);
      const res = await axios.post(
        `${serverUrl}/api/auth/resend-email`,
        { email: userData.email },
        { withCredentials: true } // ensure cookies are sent
      );

      toast.success(res.data.message);
    } catch (error) {
      console.error("Resend Email Error:", error);
      toast.error(error.response?.data?.message || "Error sending email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-4">Verify Your Email</h1>
        <p className="text-gray-600 mb-6">
          A verification link has been sent to your email.
          Please complete the verification process to continue.
        </p>

        <button
          onClick={resendEmail}
          disabled={loading || !userData}
          className={`w-full py-2 rounded-md text-white ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-black hover:bg-gray-900"
          }`}
        >
          {loading ? "Sending..." : "Resend Email"}
        </button>
      </div>
    </div>
  );
}
