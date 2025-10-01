// MessageArea.jsx
import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { LuImage } from "react-icons/lu";
import { IoCloseCircle } from "react-icons/io5";

import axios from "axios";
import { setMessages } from "../redux/messageSlice";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";

const MessageArea = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const { selectedUser, messages } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const dispatch = useDispatch();
  const imageInput = useRef();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const messageEndRef = useRef()

  if (!selectedUser?.user) return null;

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${baseUrl}/api/message/send/${selectedUser.user._id}`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMessages([...messages, result.data.message]));
      setInput("");
      setBackendImage(null);
      setFrontendImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  //helper to check user Ownership safely
  const isMine = (mess) => {
    const senderId = mess?.sender?._id || mess?.sender;
    return senderId === userData?.user?._id;
  };

  const getAllMessages = async () => {
    try {
      const result = await axios.get(
        `${baseUrl}/api/message/getAll/${selectedUser.user._id}`,
        { withCredentials: true }
      );
      dispatch(setMessages(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  useEffect( () => {
    socket?.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]))
    })
    return () => socket.off("mewMessage")
  },[messages, setMessages])

useEffect(() => {
  const timeout = setTimeout(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 50);
  return () => clearTimeout(timeout);
}, [messages]);


  return (
    <div className="w-full h-screen flex flex-col bg-neutral-100">
      {/* Top Bar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white shadow-md sticky top-0 z-50">
        <button className="text-blue-500" onClick={() => navigate(-1)}>
          <IoArrowBack size={24} />
        </button>
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={selectedUser.user.profileImage.url}
          alt="profile"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">
            {selectedUser.user.name}
          </span>
          <span className="text-xs text-gray-500">
            @{selectedUser.user.userName}
          </span>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto pt-4 space-y-4">
        {messages &&
          messages?.map((mess, index) =>
            isMine(mess) ? (
              <SenderMessage key={index} message={mess} />
            ) : (
              <ReceiverMessage key={index} message={mess} />
            )
          )}
          <div ref={messageEndRef} />
      </div>

      {/* Preview image (with cancel option) */}
      {frontendImage && (
        <div className="absolute bottom-20 right-4 w-28 h-28 rounded-lg overflow-hidden border border-gray-300 shadow-md z-50">
          <img
            src={frontendImage}
            alt="preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => {
              setFrontendImage(null);
              setBackendImage(null);
            }}
            className="absolute top-0 right-0 text-white bg-black/60 rounded-full"
          >
            <IoCloseCircle size={24} />
          </button>
        </div>
      )}

      {/* Bottom Message Input */}
      <div className="sticky bottom-0 w-full bg-white border-t border-gray-300 px-4 py-2 z-50">
        <div className="w-full max-w-[100%] lg:max-w-[70%] mx-auto">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <input
              type="file"
              accept="image/*"
              ref={imageInput}
              hidden
              onChange={handleImage}
            />

            <button
              type="button"
              className="text-gray-600 hover:text-blue-600"
              onClick={() => imageInput.current.click()}
            >
              <LuImage size={22} />
            </button>

            {(input || frontendImage) && (
              <button
                type="submit"
                className="text-blue-600 hover:text-blue-700"
              >
                <IoMdSend size={24} />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageArea;
