import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import {FaEdit} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'
import {setLectureData} from '../../redux/lectureSlice'
import toast from 'react-hot-toast'
import { serverUrl } from '../config/config'

export default function CreateLecture() {
    const {courseId}=useParams()
    const navigate =useNavigate()

    const [lectureTitle,setlectureTitle]=useState("")
    const [loading,setloading]=useState(false)
    const dispatch=useDispatch()
    const {lectureData}=useSelector(state=>state.lecture)

    const handleCreateLecture = async () => {
  setloading(true)
  try {
    const result = await axios.post(
      `${serverUrl}/api/course/createlecture/${courseId}`,
      { lectureTitle },
      { withCredentials: true }
    )

    // ✅ safe append
    dispatch(setLectureData([...(Array.isArray(lectureData) ? lectureData : []), result.data.lecture]))

    toast.success("Lecture added")
    setlectureTitle("")
  } catch (error) {
    toast.error(error.response?.data?.message || "Error creating lecture")
  } finally {
    setloading(false)
  }
}

    useEffect(() => {
  const getCourseLecture = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/course/getcourselecture/${courseId}`,
        { withCredentials: true }
      )
      dispatch(setLectureData(result.data.lectures))
    } catch (error) {
      console.error(error)
      toast.error("Failed to load lectures")
    }
  }

  getCourseLecture()
}, [courseId, dispatch])




  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
        <div className='bg-white shadow-xl rounded-xl w-full max-w-2xl p-6'>
            {/*Header */}
            <div className='mb-6'>
                <h1 className='text-2xl font-semibold text-gray-800 mb-1'>
                    Create Course Lecture
                </h1>
                <p className='text-sm text-gray-500'>
                    Enter title & add your video leactures to enhance your course content
                </p>
            </div>
            {/*Input Area */}
            <input type="text" className='w-full border border-gray-300 rounded-md 
            p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black mb-4'
            placeholder='e.g. Introduction to MERN STACK' onChange={(e)=>setlectureTitle
                (e.target.value)
            } value={lectureTitle} />

            {/*Button */}
            <div className='flex gap-4 mb-6'>
                <button className='flex items-center gap-2 px-4 py-2 rounded-md 
                bg-gray-200 hover:bg-gray-300 text-sm font-medium' onClick={() => navigate(`/editcourse/${courseId}`)}>
                    <FaArrowLeftLong
                          className="absolute top-4 left-4 w-6 h-6 cursor-pointer"
                          onClick={() => navigate(`/editcourse/${courseId}`)}
                        /> Back to Course</button>
                <button className='px-5 py-2 rounded-md bg-black text-white hover:bg-gray-600
                transition-all text-sm font-medium shadow' onClick={handleCreateLecture} disabled={loading} >{
                    loading? <ClipLoader size={30} color='white' /> : "+ Create Lecture"
                }</button>
            </div>

            {/*Lectures List*/}

            <div className='space-y-2'>
                {(lectureData || []).map((lecture,index)=>(
                    <div key={index} className='bg-gray-100 rounded-md flex justify-between
                    items-center p-3 text-sm font-medium text-gray-700'>
                        <span>Lecture - {index+1}: {lecture.lectureTitle}</span>
                        <FaEdit className='text-gray-500 hover:text-gray-700 cursor-pointer' 
                        onClick={()=>navigate(`/editlecture/${courseId}/${lecture._id}`)} />
                    </div>
                ))}
            </div>

        </div>
      
    </div>
  )
}
