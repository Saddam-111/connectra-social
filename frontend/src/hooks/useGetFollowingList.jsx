import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFollowingList } from "../redux/userSlice";

const useGetFollowingList = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const result = await axios.get(
          `${baseUrl}/api/user/followingList`,
          { withCredentials: true }
        );
        //console.log(result.data.following._id)
        dispatch(setFollowingList(result.data)); // ✅ only update following list
      } catch (error) {
        console.error(
          "Error fetching following list:",
          error?.response?.data || error.message
        );
      }
    };

    fetchFollowing();
  }, [baseUrl]);
};

export default useGetFollowingList;
