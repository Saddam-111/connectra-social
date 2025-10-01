import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setSuggestedUsers } from '../redux/userSlice';

const useSuggestedUser = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);

  useEffect(() => {
    if (!userData?.user?._id) return; // wait for current user

    const fetchSuggestedUsers = async () => {
      try {
        const result = await axios.get(`${baseUrl}/api/user/suggested`, {
          withCredentials: true,
        });
        dispatch(setSuggestedUsers(result.data));
      } catch (error) {
        console.error(
          "Failed to fetch suggested users:",
          error?.response?.data?.message || error.message
        );
      }
    };

    fetchSuggestedUsers();
  }, [baseUrl, dispatch, userData?.user?._id]); // fetch after current user is loaded
};

export default useSuggestedUser;
