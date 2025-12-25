import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserdata } from "../redux/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/user/getcurrentuser",
          { withCredentials: true }
        );

        if (res.data?.user) {
          dispatch(setUserdata(res.data.user)); 
        } else {
          dispatch(setUserdata(null));
        }
      } catch (err) {
        console.error("Fetch current user error:", err);
        dispatch(setUserdata(null));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  return { loading };
};

export default useGetCurrentUser;
