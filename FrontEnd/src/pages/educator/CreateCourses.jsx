import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'

export default function CreateCourses() {
    const [title,setTitle]=useState("")
    const [category,setCategory]=useState("")
    const [loading,setLoading]=useState(false)

    const serverUrl = import.meta.env.VITE_SERVER_URL;

    const handleCreateCourse= async ()=>{
        setLoading(true)
        try {
            const result=await axios.post( `${serverUrl}/api/course/create`,{title,category},{withCredentials:true})
            console.log(result.data)
            navigate("/courses")
            setLoading(false)
            toast.success("Course created successfully")
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
            setLoading(false)
        }
    }

    const navigate=useNavigate()
  return (
    <div className='min-h-screen flex items-center justify-center gb-gray-100
    px-4 py-10'>
      <div className='max-w-xl w-[600px] mx-auto p-6 bg-white shadow-md rounded-md mt-10 relative'>

        <FaArrowLeftLong
                  className="absolute top-4 left-4 w-6 h-6 cursor-pointer"
                  onClick={() => navigate("/courses")}
                />

        <h2 className='text-2xl font-semibold mb-6 text-center'>Create Course</h2>

        <form action="" className='space-y-5' onSubmit={(e)=>e.preventDefault()}>
            <div>
                <label htmlFor="title" className='block text-sm font-medium mb-1 text-gray-700'>Course Title</label>
                <input type="text" name="" id="title" placeholder='Enter course title' className='w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none'
                onChange={(e)=>setTitle(e.target.value)} value={title} />
            
                <label htmlFor="cat" className='block text-sm font-medium mb-1 text-gray-700'>Course Category</label>
                <select onChange={(e)=>setCategory(e.target.value)} name="" id="cat" className='w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none'>
                    <option value="">Select Category</option>
                    <option value="App Development">App Development</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="AI Tools">AI Tools</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="Ethical hacking">Ethical hacking</option>
                    <option value="UI UX Designing">UI UX Designing</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Others">Others </option>
                </select>
            </div>
            <button onClick={handleCreateCourse} disabled={loading} className='w-full bg-[black] text-white py-2 px-4 rounded-md active:bg-[#3a3a3a] transition'>
                {loading? <ClipLoader size={30} color='white' />:  "Create"}
            </button>
        </form>
      </div>
    </div>
  )
}
