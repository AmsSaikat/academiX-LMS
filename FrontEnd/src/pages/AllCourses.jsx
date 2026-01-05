import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Card from '../components/Card'
import Navbar from './Navbar'

export default function AllCourses() {
  const { creatorCourseData } = useSelector(state => state.course) // ✅ use correct slice field
  const navigate = useNavigate()

  const [selectedCategories, setSelectedCategories] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])

  // ✅ Always show all courses first
  useEffect(() => {
    setFilteredCourses(creatorCourseData || [])
  }, [creatorCourseData])

  // ✅ Apply filter only when user selects categories
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredCourses(creatorCourseData || [])
    } else {
      setFilteredCourses(
        (creatorCourseData || []).filter(c => selectedCategories.includes(c.category))
      )
    }
  }, [selectedCategories, creatorCourseData])

  // ✅ Category toggle
  const handleCategoryChange = (e) => {
    const value = e.target.value
    setSelectedCategories(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    )
  }

  const categories = [
    'App Development',
    'Web Development',
    'AI/ML',
    'Data Science',
    'AI Tools',
    'Data Analytics',
    'Ethical Hacking',
    'UI UX Designing',
    'Others'
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar: 30–40% width */}
      <aside className="w-[35%] min-h-screen bg-black text-white p-8">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
          <FaArrowLeftLong onClick={() => navigate('/')} className="cursor-pointer" />
          Filter by Category
        </h2>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-4 text-sm bg-gray-600 border border-white p-5 rounded-2xl"
        >
          <button
            className="px-3 py-2 bg-black text-white rounded-lg text-sm font-light flex items-center justify-center gap-2 cursor-pointer w-full"
          >
            Search with AI
          </button>

          {categories.map(cat => (
            <label
              key={cat}
              className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition"
            >
              <input
                type="checkbox"
                value={cat}
                onChange={handleCategoryChange}
                checked={selectedCategories.includes(cat)}
                className="accent-black w-4 h-4 rounded-md"
              />
              {cat}
            </label>
          ))}
        </form>
      </aside>

      {/* Main content: 60–70% width */}
      <main className="w-[65%] flex flex-col min-h-screen">
        {/* Top bar with options */}
        <div className="flex justify-between items-center bg-white shadow px-6 py-4">
          <Navbar />
        </div>

        {/* Courses grid */}
        <div className="flex flex-wrap gap-6 p-6">
          {filteredCourses?.length > 0 ? (
            filteredCourses.map(course => (
              <Card
                key={course._id}
                thumbnail={course.thumbnail}
                title={course.title || "Untitled Course"}   // fallback if no title
                category={course.category || "Uncategorized"}
                price={course.price || "Free"}
                id={course._id}
              />
            ))
          ) : (
            <p className="text-gray-500 text-lg">No courses available.</p>
          )}
        </div>
      </main>
    </div>
  )
}