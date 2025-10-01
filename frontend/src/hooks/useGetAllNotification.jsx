import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationData } from "../redux/userSlice";




function useGetAllNotification(){
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch()
  const {userData} = useSelector(state => state.user)

  useEffect( () => {
    const fetchNotification = async () => {
        try {
          const result = await axios.get(`${baseUrl}/api/user/getAllNotification`, {withCredentials: true})
          dispatch(setNotificationData(result.data))
        } catch (error) {
          console.log(error)
        }

    }
    fetchNotification()
    
  }, [dispatch, baseUrl, userData])
}


export default useGetAllNotification