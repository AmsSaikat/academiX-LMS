import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import VerifyEmailCallback from "./pages/VerifyEmailCallBack";
import EditProfile from "./pages/EditProfile";
import MyProfile from "./pages/MyProfile";

import Courses from "./pages/educator/Courses";
import EditCourse from "./pages/educator/EditCourse";
import DashBoard from "./pages/educator/DashBoard";
import CreateCourses from "./pages/educator/CreateCourses";


import useGetCurrentUser from "./customHooks/getCurrentUser";
import getCreatorCourse from "./customHooks/getCreatorCourse";
import AllCourses from "./pages/AllCourses";
import CreateLecture from "./pages/educator/Createlecture";
import EditLecture from "./pages/educator/EditLecture";
import ViewCourses from "./pages/ViewCourses";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const { loading } = useGetCurrentUser(); // fixed: now loading comes from hook
  getCreatorCourse(); // keep as you wrote

  const {userData} = useSelector((state) => state.user);

  if (loading) return <div>Loading...</div>; // prevent route render

  return (
    <>
      <Toaster />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/all-courses" element={<AllCourses />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/verify-email/:token" element={<VerifyEmailCallback />} />

        {/* Protected Routes */}
        <Route path="/edit-profile" element={userData ? <EditProfile /> : <Navigate to={"/signup"} />} />
        <Route path="/profile" element={userData ? <MyProfile /> : <Navigate to={"/signup"} /> } />
        
        <Route path="/dashboard" element={ userData?.role === "teacher" ? <DashBoard /> : <Navigate to={"/signup"} />}/>
        <Route path="/courses" element={userData?.role === "teacher" ? <Courses /> : <Navigate to={"/signup"} />}/>
        <Route path="/createcourse" element={userData?.role === "teacher" ? <CreateCourses /> : <Navigate to={"/signup"} />}/>
        <Route path="/editcourse/:courseId" element={userData?.role === "teacher" ? <EditCourse /> : <Navigate to={"/signup"} />}/>
        <Route path="/createlecture/:courseId" element={userData?.role === "teacher" ? <CreateLecture /> : <Navigate to={"/signup"} />}/>
        <Route path="/editlecture/:courseId/:lectureId" element={userData?.role === "teacher" ? <EditLecture /> : <Navigate to={"/signup"} />}/>
        <Route path="/viewcourse/:courseId" element={ userData?.role === "teacher" ? <ViewCourses /> : <Navigate to={"/signup"} />}/>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
