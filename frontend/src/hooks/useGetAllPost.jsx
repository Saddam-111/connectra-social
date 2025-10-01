import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setPostData } from '../redux/postSlice';
import React from 'react';


const useGetAllPost = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const {userData} = useSelector(state => state.user)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await axios.get(`${baseUrl}/api/post/getAllPost`, {
          withCredentials: true,
        });
        dispatch(setPostData(result.data.posts));
      } catch (error) {
        console.error("Failed to fetch posts:", error?.response?.data?.message || error.message);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [baseUrl, dispatch, userData]);

  return { loading, error };
};


export default useGetAllPost