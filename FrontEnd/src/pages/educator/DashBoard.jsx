import React from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CourseGraph from '../../components/CourseGraph'

export default function DashBoard() {
  const navigate =useNavigate()
  const {userData}=useSelector(state=>state.user)
  return (
    <div className='flex min-h-screen items-center bg-gray-100'>
      <div className='w-full space-y-10 px-6 py-10 bg-gray-50'>

        <FaArrowLeftLong
                  className="absolute top-4 left-4 w-6 h-6 cursor-pointer"
                  onClick={() => navigate("/home")}
                />

        {/*Main section*/}
        <div className='max-w-5xl mx-auto bg-white rounded-xl
        shadow-md p-6 flex flex-col md:flex-row items-center
        gap-6'>
          <img src={userData?.photoUrl || userData?.name.slice(0,1).toUpperCase()} alt="" className='
          w-28 h-28 rounded-full object-cover border-4 border-black shadow-md' />

          <div className='text-center md:text-left space-y-1'> 
            <h1 className='text-2xl font-bold text-gray-800'>
              Welcome, {userData?.name || "Educator"}
            </h1>
            <h1 className='text-xl font-semibold text-gray-800'>
              Total Earning : 0
            </h1>
            <p className='text-gray-600 text-sm'>
              {userData?.description  ||  "Start creating courses for students world-wide"}
            </p>

            <h1 className='px-[10px] text-center py-[10px] border-2 bg-black border-black 
            text-white rounded-[10px] text-[15px] font-light flex items-center
            justify-center cursor-pointer ' onClick={()=>navigate("/courses")}>Create Courses</h1>
          </div>
        </div>

        {/*Graph section*/}
        <div className='pl-20 pr-20 w-full h-full  bg-gray-100 mt-20'>
          <CourseGraph />
        </div>
      </div>
    </div>
  )
}
