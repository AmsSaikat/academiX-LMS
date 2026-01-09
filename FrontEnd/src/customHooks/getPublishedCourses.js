import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCourseData } from "../redux/courseSlice";
import { serverUrl } from "../pages/config/config";

function useGetPublishedCourses() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCourseData = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/course/getPublished`,
          { withCredentials: true }
        );

        dispatch(setCourseData(result.data));
      } catch (error) {
        console.log("Error in getPublishedHook", error);
      }
    };

    getCourseData(); // ✅ IMPORTANT
  }, [dispatch]);
}

export default useGetPublishedCourses;
