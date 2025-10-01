import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { setUserData } from "../redux/userSlice";

const EditProfile = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: userData?.user?.name || "",
    userName: userData?.user?.userName || "",
    bio: userData?.user?.bio || "",
    profession: userData?.user?.profession || "",
    gender: userData?.user?.gender || "",
    profileImage: userData?.user?.profileImage?.url || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getImageSrc = () => {
    if (formData.previewImage) return formData.previewImage;
    if (
      typeof formData.profileImage === "string" &&
      formData.profileImage.trim() !== ""
    ) {
      return formData.profileImage;
    }
    return "/default.jpg";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profileImage: file,
        previewImage: URL.createObjectURL(file), // Add a preview URL
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("userName", formData.userName);
      form.append("bio", formData.bio);
      form.append("profession", formData.profession);
      form.append("gender", formData.gender);

      // Only append image if the user actually changed it (i.e. it's a File)
      if (formData.profileImage instanceof File) {
        form.append("profileImage", formData.profileImage);
      }

      const res = await axios.post(`${baseUrl}/api/user/editProfile`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      dispatch(setUserData(res.data));
      navigate(-1);
    } catch (err) {
      console.error("Profile update error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-4 py-6">
      {/* Top bar */}
      <div className="flex items-center gap-1 mb-6 cursor-pointer" onClick={() => navigate(-1)} >
        <button className="text-blue-500">
          <IoArrowBack size={24} />
        </button>
        <h2 className="text-xl font-semibold">Edit Profile</h2>
      </div>

      {/* Profile image */}
     <div className="flex justify-center mb-6">
  <label htmlFor="profileImage" className="cursor-pointer relative flex flex-col items-center space-y-2">
    <img
      src={getImageSrc()}
      alt="Profile"
      className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-blue-500"
    />
    <p className="text-sm md:text-base font-medium text-blue-600 hover:underline">
      Change Your Profile Picture
    </p>
    <input
      type="file"
      id="profileImage"
      accept="image/*"
      className="hidden"
      onChange={handleImageChange}
    />
  </label>
</div>


      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm space-y-4 w-full max-w-md mx-auto"
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={handleChange}
          rows="3"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <input
          type="text"
          name="profession"
          placeholder="Profession"
          value={formData.profession}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
