import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';

const useCurrentUser = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${baseUrl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.error("Failed to fetch current user:", error?.response?.data?.message || error.message);
        dispatch(setUserData(null));
      }
    };

    fetchUser();
  }, [baseUrl, dispatch]); // remove storyData from deps
};

export default useCurrentUser;
