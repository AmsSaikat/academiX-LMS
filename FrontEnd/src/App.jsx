import React from 'react'
import {Routes,Route} from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgetPassword from './pages/ForgetPassword'
import ResetPassword from './pages/ResetPassword'

export default function App() {
  return (
    <>
    <div>
      <Toaster/>
    </div>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/forgot-password' element={<ForgetPassword />}/>
      <Route path="/reset-password/:token" element={<ResetPassword />} />

    </Routes>
    </>
  )
}
