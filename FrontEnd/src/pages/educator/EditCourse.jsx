import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { setCourseData } from "../../redux/courseSlice";
import { FaEdit } from "react-icons/fa";

export default function EditCourse() {
  const [selectCourse, setSelectCourse] = useState(null);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const thumb = useRef();

  const [isPublished, setIsPublished] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [frontEndImg, setFrontEndImg] = useState(null);
  const [backEndImg, setBackEndImg] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const serverUrl = import.meta.env.VITE_SERVER_URL;


  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.course);

    const handleThumbnail = (e) => {
    const file = e.target.files[0]; // fixed typo
    if (file) {
      setBackEndImg(file);
      setFrontEndImg(URL.createObjectURL(file));
    }
  };

  const getCourseById = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/course/getcourse/${courseId}`,
        { withCredentials: true }
      );
      setSelectCourse(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectCourse) {
      setTitle(selectCourse.title || "");
      setSubtitle(selectCourse.subtitle || "");
      setDescription(selectCourse.description || "");
      setPrice(selectCourse.price || "");
      setLevel(selectCourse.level || "");
      setCategory(selectCourse.category || "");
      setFrontEndImg(selectCourse.thumbnail || "");
      setIsPublished(!!selectCourse.isPublished);
    }
  }, [selectCourse]);

  useEffect(() => {
    getCourseById(); // call fetch
  }, []);

    const handleEditCourse = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("description", description);
    formData.append("level", level);
    formData.append("price", price);
    formData.append("category", category);
    if (backEndImg) {
      formData.append("thumbnail", backEndImg);
    }
    formData.append("isPublished", isPublished);

    try {
      const result = await axios.post(
        `${serverUrl}/api/course/editcourse/${courseId}`,
        formData,
        { withCredentials: true }
      );

      const updateData = result.data;

      let updateCourses;
if (updateData.isPublished) {
  updateCourses = (courseData || []).map((c) =>
    c._id === courseId ? updateData : c
  );
  if (!courseData?.some((c) => c._id === courseId)) {
    updateCourses.push(updateData);
  }
} else {
  updateCourses = (courseData || []).filter((c) => c._id !== courseId);
}

      dispatch(setCourseData(updateCourses));
      toast.success("Course updated");
      navigate("/courses");
    } catch (error) {
      console.log("Error in Edit course", error);
      toast.error(error.response?.data?.message || "Error updating course");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourse = async () => {
    setLoading2(true);
    try {
      await axios.delete(`${serverUrl}/api/course/remove/${courseId}`
, {
        withCredentials: true,
      });
      const filterCourses = (courseData || []).filter((c) => c._id !== courseId);
      dispatch(setCourseData(filterCourses));
      toast.success("Course removed successfully");
      navigate("/courses");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error removing course");
    } finally {
      setLoading2(false);
    }
  };

    return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      {/* Top bar */}
      <div className="flex items-center justify-center gap-[20px] md:justify-between flex-col md:flex-row mb-6 relative">
        <FaArrowLeftLong
          className="absolute top-4 left-4 w-6 h-6 cursor-pointer"
          onClick={() => navigate("/courses")}
        />
        <h2 className="text-2xl font-semibold md:pl-[60px]">
          Add detailed information regarding the course
        </h2>
        <div className="space-x-2 space-y-2">
          <button className="bg-black text-white px-4 py-2 rounded-md">
            Go to lectures
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-gray-50 p-6 rounded-md">
        <h2 className="text-lg font-medium mb-4">Basic Course Information</h2>
        <div className="space-x-2 space-y-2">
          <button
            onClick={() => setIsPublished((prev) => !prev)}
            className="bg-green-100 px-4 rounded-md border-1 py-2"
          >
            {isPublished ? "Click to UnPublish" : "Click to Publish"}
          </button>
          <button
            onClick={handleRemoveCourse}
            className="bg-green-100 px-4 rounded-md border-1 py-2"
          >
            {loading2 ? <ClipLoader size={30} color="white" /> : "Remove Course"}
          </button>
        </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Course title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subtitle">
              Subtitle
            </label>
            <input
              id="subtitle"
              onChange={(e) => setSubtitle(e.target.value)}
              value={subtitle}
              type="text"
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Course Subtitle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="des">
              Description
            </label>
            <textarea
              id="des"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Course Description"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                onChange={(e) => setLevel(e.target.value)}
                value={level}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advance">Advance</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Category
              </label>
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              >
                <option value="">Select Category</option>
                <option value="App Development">App Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Data Science">Data Science</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Ethical hacking">Ethical hacking</option>
                <option value="UI UX Designing">UI UX Designing</option>
                <option value="Web Development">Web Development</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Price
              </label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                type="number"
                className="w-full border px-4 py-2 rounded-md"
                placeholder="Course Price $"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail
            </label>
            <input
              type="file"
              hidden
              ref={thumb}
              accept="image/*"
              onChange={handleThumbnail}
            />
            <div className="relative w-[300px] h-[170px] mt-2">
              {frontEndImg ? (
                <img
                  src={frontEndImg}
                  alt="Thumbnail"
                  className="w-full h-full object-cover border border-black rounded-[5px] cursor-pointer"
                  onClick={() => thumb.current?.click()}
                />
              ) : (
                <div
                  className="w-full h-full border border-dashed border-gray-400 rounded-[5px] flex items-center justify-center text-gray-500 cursor-pointer"
                  onClick={() => thumb.current?.click()}
                >
                  Click to upload thumbnail
                </div>
              )}
              <FaEdit
                className="absolute top-2 right-2 text-gray-600 hover:text-blue-600 cursor-pointer"
                onClick={() => thumb.current?.click()}
              />
            </div>
          </div>

          <div className="flex items-center justify-start gap-[15px]">
            <button
              onClick={() => navigate("/courses")}
              className="bg-[#e9e8e8] hover:bg-red-200 text-black border border-black cursor-pointer px-7 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleEditCourse}
              className="bg-black hover:bg-gray-500 text-white border border-black cursor-pointer px-7 py-2 rounded-md"
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}