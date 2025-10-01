import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setPrevChatUsers } from '../redux/messageSlice';

const useGetPrevChatUsers = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user); // ensure current user is loaded

  useEffect(() => {
    if (!userData?.user?._id) return; // wait for current user

    const fetchPrevChatUsers = async () => {
      try {
        const result = await axios.get(`${baseUrl}/api/message/prevChats`, {
          withCredentials: true,
        });
        dispatch(setPrevChatUsers(result.data));
        console.log(result.data);
      } catch (error) {
        console.error(
          "Failed to fetch previous chat users:",
          error?.response?.data?.message || error.message
        );
      }
    };

    fetchPrevChatUsers();
  }, [baseUrl, dispatch, userData?.user?._id]); // fetch only when current user is available
};

export default useGetPrevChatUsers;
