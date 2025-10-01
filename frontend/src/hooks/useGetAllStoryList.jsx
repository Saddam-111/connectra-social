import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setStoryList } from '../redux/storySlice';

const useGetAllStoryList = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const result = await axios.get(`${baseUrl}/api/story/getAll`, {
          withCredentials: true,
        });
        dispatch(setStoryList(result.data.stories)); // corrected
      } catch (error) {
        console.error("Failed to fetch stories:", error?.response?.data?.message || error.message);
        dispatch(setStoryList([])); // fallback to empty array
      }
    };

    fetchStories();
  }, [baseUrl, dispatch]);
};

export default useGetAllStoryList;
