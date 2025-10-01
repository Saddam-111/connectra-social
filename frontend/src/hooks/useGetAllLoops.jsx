import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setPostData } from '../redux/postSlice';
import React from 'react';
import { setLoopData } from '../redux/loopSlice';


const useGetAllLoops = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {userData} = useSelector(state => state.user)

  useEffect(() => {
    const fetchLoop = async () => {
      try {
        const result = await axios.get(`${baseUrl}/api/loop/getAll`, {
          withCredentials: true,
        });
        dispatch(setLoopData(result.data.loops));
      } catch (error) {
        console.error("Failed to fetch loops:", error?.response?.data?.message || error.message);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoop();
  }, [baseUrl, dispatch, userData]);

  return { loading, error };
};


export default useGetAllLoops