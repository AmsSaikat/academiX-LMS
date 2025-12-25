import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserdata } from "../redux/userSlice";

export default function VerifyEmailCallback() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        toast.success(res.data.message || "Email verified successfully!");

        // Update local user as verified
        dispatch(setUserdata(res.data.user)); // Store user in Redux

        // Delay navigation slightly so toast is visible
        setTimeout(() => navigate("/login"), 1200);
      } catch (error) {
        toast.error(error.response?.data?.message || "Email verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <h2 className="text-xl font-semibold mb-4">
        {loading ? "Verifying your email..." : "Verification Complete"}
      </h2>
      {!loading && (
        <p className="text-gray-600 text-center">
          You will be redirected to the login page shortly.
        </p>
      )}
    </div>
  );
}
