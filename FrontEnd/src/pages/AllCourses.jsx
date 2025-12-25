import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Card from '../components/Card'

export default function AllCourses() {
    const {courseData}=useSelector(state=>state.course)
    const navigate=useNavigate( )
    const [category,setCategory]=useState([])
    const [filterCourses,setFilterCourses]=useState([])

    const toggleCatagory=(e)=>{
        if(toggleCatagory.includes(e.target.value)){
            setCategory(prev=>prev.filter(c=>c!==e.target.value))
        }else{
            setCategory(prev=>[...prev,e.target.value])
        }
    }
    

    const applyFilter=()=>{{
        let courseCopy=courseData?.slice()
        if(toggleCatagory.length>0){
            courseCopy=courseCopy.filter(c=>toggleCatagory.includes(c.Category))
        }
        setFilterCourses(courseCopy)
    }}

    useEffect(()=>{
        setFilterCourses(courseData)
    },[courseData])

    useEffect(()=>{
        applyFilter()
    },[category])



  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Navbar />
      {/*Sidebar*/}
      <aside className='w-[260px] h-screen overflow-y-auto bg-black fixed top-0 left-0 *:p-6 py-[130px] border-r
      border-gray-200 shadow-md transition-transform duration-300 z-5 '>
        <h2 className='text-xl font-bold flex items-center justify-center
        gap-2 text-gray-50 mb-6'
        ><FaArrowLeftLong onClick={()=>navigate('/')} className='text-white' /> Filter by catagory</h2>



        <form onSubmit={(e)=>e.preventDefault()} action="" className='space-y-4 text-sm bg-gray-600 
        border-white text-white border p-[20px] rounded-2xl'>


            <button className='px-[10px] py-[10px] bg-black text-white rounded-[10px]
            text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer'>
                Search with Ai
            </button>

            <label htmlFor="" className='flex items-center gap-3 cursor-pointer
            hover:text-gray-200 transition'>
                <input onChange={toggleCatagory} value={'App Development'} type="checkbox" name="" id="" 
                className='accent-black w-4 h-4 rounded-md'/>
                App Development
            </label>

            <label htmlFor="" className='flex items-center gap-3 cursor-pointer
            hover:text-gray-200 transition'>
                <input onChange={toggleCatagory} value={'Web Development'} type="checkbox" name="" id="" 
                className='accent-black w-4 h-4 rounded-md'/>
                Web Development
            </label>

            <label htmlFor="" className='flex items-center gap-3 cursor-pointer
            hover:text-gray-200 transition'>
                <input onChange={toggleCatagory} value={'AI/ML Development'} type="checkbox" name="" id="" 
                className='accent-black w-4 h-4 rounded-md'/>
                AI/ML Development
            </label>

            <label htmlFor="" className='flex items-center gap-3 cursor-pointer
            hover:text-gray-200 transition'>
                <input onChange={toggleCatagory} value={'Data Science'} type="checkbox" name="" id="" 
                className='accent-black w-4 h-4 rounded-md'/>
                Data Science
            </label>

            <label htmlFor="" className='flex items-center gap-3 cursor-pointer
            hover:text-gray-200 transition'>
                <input onChange={toggleCatagory} value={'AI Tools'} type="checkbox" name="" id="" 
                className='accent-black w-4 h-4 rounded-md'/>
                AI Tools
            </label>

            <label htmlFor="" className='flex items-center gap-3 cursor-pointer
            hover:text-gray-200 transition'>
                <input onChange={toggleCatagory} value={'Dara Analytics'} type="checkbox" name="" id="" 
                className='accent-black w-4 h-4 rounded-md'/>
                Data Analytics
            </label>

            <label htmlFor="" className='flex items-center gap-3 cursor-pointer
            hover:text-gray-200 transition'>
                <input onChange={toggleCatagory} value={'Ethical Hacking'} type="checkbox" name="" id="" 
                className='accent-black w-4 h-4 rounded-md'/>
                Ethical Hacking
            </label>

            <label htmlFor="" className='flex items-center gap-3 cursor-pointer
            hover:text-gray-200 transition'>
                <input onChange={toggleCatagory} value={'UI UX Designing'} type="checkbox" name="" id="" 
                className='accent-black w-4 h-4 rounded-md'/>
                UI UX Designing
            </label>

            <label htmlFor="" className='flex items-center gap-3 cursor-pointer
            hover:text-gray-200 transition'>
                <input onChange={toggleCatagory} value={'Others'} type="checkbox" name="" id="" 
                className='accent-black w-4 h-4 rounded-md'/>
                Others
            </label>
        </form>
      </aside>



      <main className='w-full transition-all duration-300 py-[130px] md:pl-[300px]
      flex items-center justify-center md:justify-start flex-wrap gap-6 px-[10px]'>
        {
            filterCourses?.map((course,index)=>(
                <Card key={index} thumbnail={course.thumbnail} title={course.title} catagory={course.catagory}
                price={course.price} id={course._id} />
            ))
        }
      </main>
    </div>
  )
}
