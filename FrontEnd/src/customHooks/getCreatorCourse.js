import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCreatorCourseData } from "../redux/courseSlice";
import toast from "react-hot-toast";

const useGetCreatorCourse = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const creatorCourses = async () => {
      try {
        const result = await axios.get(
          "http://localhost:5000/api/course/getcreator",
          { withCredentials: true }
        );

        dispatch(setCreatorCourseData(result.data));
      } catch (error) {
        console.log(error);
        toast.error("error in getCreatorCourseHook");
      }
    };

    // only fetch if user exists
    if (userData) {
      creatorCourses();
    }
  }, [userData, dispatch]);
};

export default useGetCreatorCourse;
