import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Template from "./pages/Template";
import Loading from "./components/Loading";
import { useDispatch, useSelector } from "react-redux";
import useCurrentUser from "./hooks/useCurrentUser";
import useSuggestedUser from "./hooks/useSuggestedUser";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Upload from "./pages/Upload";
import useGetAllPost from "./hooks/useGetAllPost";
import Loops from "./pages/Loops";
import useGetAllLoops from "./hooks/useGetAllLoops";
import Story from "./pages/Story";
import useGetAllStoryList from "./hooks/useGetAllStoryList";
import Messages from "./pages/Messages";
import MessageArea from "./pages/MessageArea";
import { useEffect } from "react";
import {io} from 'socket.io-client'
import { setOnlineUsers, setSocket } from "./redux/socketSlice";
import useGetFollowingList from "./hooks/useGetFollowingList";
import useGetPrevChatUsers from "./hooks/useGetPrevChatUsers";
import Search from "./pages/Search";
import useGetAllNotification from "./hooks/useGetAllNotification";
import Notifications from "./pages/Notifications";
import { setNotificationData } from "./redux/userSlice";


const App = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  useCurrentUser()
  useSuggestedUser()
  useGetAllPost()
  useGetAllLoops()
  useGetAllStoryList()
  useGetFollowingList()
  useGetPrevChatUsers()
  useGetAllNotification()

 
  
  const { darkMode } = useSelector(state => state.theme)
  const { userData, loading , notificationData} = useSelector((state) => state.user); 
  const {socket} = useSelector(state => state.socket)
  const dispatch = useDispatch()
  // assume `loading` exists or skip check
useEffect(() => {
  if (userData) {
    const socketIo = io(baseUrl, {
      query: { userId: userData?.user?._id } // important!
    });
    dispatch(setSocket(socketIo));

    socketIo.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => socketIo.close(); // cleanup on unmount or user logout
  } else {
    if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }
}, [userData]);

useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

useEffect(() => {
  if (!socket) return;

  const handleNewNotification = (noti) => {
    dispatch(setNotificationData([...notificationData, noti]));
  };

  socket.on("newNotification", handleNewNotification);

  return () => {
    socket.off("newNotification", handleNewNotification);
  };
}, [socket, notificationData, dispatch]);




  // Optional: Show a loading screen while auth state is loading
  if (loading) return <Loading />;
  return (
    <Routes>
  {/* Protected Route: Home */}
  <Route
    path="/"
    element={userData ? <Home /> : <Navigate to="/intro" replace />}
  />

  {/* Intro page – accessible to all */}
  <Route path="/intro" element={<Template />} />

  {/* Public routes: Redirect to home if user is already logged in */}
  <Route
    path="/signup"
    element={!userData ? <SignUp /> : <Navigate to="/" replace />}
  />
  <Route
    path="/signin"
    element={!userData ? <SignIn /> : <Navigate to="/" replace />}
  />
  <Route
    path="/forgot-password"
    element={!userData ? <ForgotPassword /> : <Navigate to="/" replace />}
  />

  {/* Protected routes: only accessible if logged in */}
  <Route
    path="/profile/:userName"
    element={userData ? <Profile /> : <Navigate to="/intro" replace />}
  />
  <Route
    path="/story/:userName"
    element={userData ? <Story /> : <Navigate to="/intro" replace />}
  />
  <Route
    path="/edit-profile"
    element={userData ? <EditProfile /> : <Navigate to="/intro" replace />}
  />
  <Route
    path="/messages"
    element={userData ? <Messages /> : <Navigate to="/intro" replace />}
  />
  <Route
    path="/messageArea"
    element={userData ? <MessageArea /> : <Navigate to="/intro" replace />}
  />
  <Route
    path="/upload"
    element={userData ? <Upload /> : <Navigate to="/intro" replace />}
  />
  <Route
    path="/loops"
    element={userData ? <Loops /> : <Navigate to="/intro" replace />}
  />
  <Route
    path="/search"
    element={userData ? <Search /> : <Navigate to="/intro" replace />}
  />
  <Route
    path="/notification"
    element={userData ? <Notifications /> : <Navigate to="/intro" replace />}
  />
</Routes>

  );
};

export default App;
