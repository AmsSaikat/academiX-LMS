import axios from 'axios'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'
import { serverUrl } from '../config/config'
import { setLectureData } from '../../redux/lectureSlice'

export default function EditLecture() {
  const { courseId, lectureId } = useParams()
  const { lectureData } = useSelector(state => state.lecture)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Try to find lecture in Redux
  const selectedLecture = lectureData?.find(l => l._id === lectureId)

  // Local state with safe defaults
  const [lectureTitle, setLectureTitle] = useState(selectedLecture ? selectedLecture.lectureTitle : "")
  const [videoUrl, setVideoUrl] = useState(null)
  const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture ? selectedLecture.isPreviewFree : false)
  const [loading, setLoading] = useState(false)
  const [loadingRemove, setLoadingRemove] = useState(false)

  // If Redux didn’t have it, fetch from backend (single lecture route)
  useEffect(() => {
    if (!selectedLecture && !setLoadingRemove) {
      const fetchLecture = async () => {
        try {
          const result = await axios.get(
            `${serverUrl}/api/course/getlecture/${lectureId}`,
            { withCredentials: true }
          )
          const lecture = result.data.lecture
          setLectureTitle(lecture.lectureTitle || "")
          setIsPreviewFree(lecture.isPreviewFree || false)
        } catch (err) {
          console.error(err)
          toast.error("Failed to load lecture")
        }
      }
      fetchLecture()
    }
  }, [selectedLecture, lectureId])

  const handleEditLecture = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("lectureTitle", lectureTitle)
      if (videoUrl) formData.append("videoUrl", videoUrl)
      formData.append("isPreviewFree", isPreviewFree)

      const result = await axios.post(
        `${serverUrl}/api/course/editlecture/${lectureId}`,
        formData,
        { withCredentials: true }
      )

      // Update Redux lectures
      const updatedLectures = lectureData.map(l =>
        l._id === lectureId ? result.data.lecture : l
      )
      dispatch(setLectureData(updatedLectures))

      toast.success("Lecture updated")
      navigate(`/createlecture/${courseId}`)
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Error updating lecture")
    } finally {
      setLoading(false)
    }
  }

  const removeLecture = async () => {
    setLoadingRemove(true)
    try {
      await axios.delete(
        `${serverUrl}/api/course/removelecture/${lectureId}`,
        { withCredentials: true }
      )

      const remainingLectures = lectureData.filter(l => l._id !== lectureId)
      dispatch(setLectureData(remainingLectures))

      toast.success("Lecture removed")
      navigate(`/createlecture/${courseId}`)
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Error removing lecture")
    } finally {
      setLoadingRemove(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6'>
        <div className='flex items-center gap-2 mb-2'>
          <FaArrowLeftLong
            className="w-6 h-6 cursor-pointer"
            onClick={() => navigate(`/createlecture/${courseId}`)}
          />
          <h2 className='text-xl font-semibold text-gray-800'>
            Update Course Lecture
          </h2>
        </div>

        <button
          onClick={removeLecture}
          disabled={loadingRemove}
          className='mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all text-sm'
        >
          {loadingRemove ? <ClipLoader size={30} color='white' /> : "Remove Lecture"}
        </button>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Lecture Title*
            </label>
            <input
              required
              type="text"
              className='w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black'
              onChange={e => setLectureTitle(e.target.value)}
              value={lectureTitle}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Video*
            </label>
            <input
              type="file"
              className='w-full p-2 border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-700 file:text-white hover:file:bg-gray-500'
              accept='video/*'
              onChange={e => setVideoUrl(e.target.files[0])}
            />
          </div>

          <div className='flex items-center gap-3'>
            <input
              type="checkbox"
              checked={isPreviewFree}
              onChange={() => setIsPreviewFree(prev => !prev)}
              className='accent-black h-4 w-4'
              id='isFree'
            />
            <label className='text-sm text-gray-700' htmlFor="isFree">
              Is the Video FREE?
            </label>
          </div>

          {loading && <p>Uploading video... Please wait</p>}

          <div className='pt-4'>
            <button
              disabled={loading}
              onClick={handleEditLecture}
              className='w-full bg-black text-white rounded-md text-sm font-medium hover:bg-gray-700 transition py-3'
            >
              {loading ? <ClipLoader size={30} color='white' /> : "Update Lecture"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}