import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);

  const [data, setData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
  });

  const togglePassword = () => setShowPassword(!showPassword);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSignUp = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/auth/signup`, data, {
        withCredentials: true,
      });
      dispatch(setUserData(response.data));
      setSuccess("Signup successful!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-6xl flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 bg-white">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            Join Connectra
          </h2>

          <form className="space-y-5" onSubmit={onSignUp}>
            <div>
              <label className="block text-blue-800 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                name="name"
                value={data.name}
                onChange={onChangeHandler}
                className="w-full p-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-blue-800 font-medium">Username</label>
              <input
                type="text"
                placeholder="Unique username"
                name="userName"
                value={data.userName}
                onChange={onChangeHandler}
                className="w-full p-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-blue-800 font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                name="email"
                value={data.email}
                onChange={onChangeHandler}
                className="w-full p-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-blue-800 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  name="password"
                  value={data.password}
                  onChange={onChangeHandler}
                  className="w-full p-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-600 cursor-pointer"
                  onClick={togglePassword}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <p className="text-sm text-center text-gray-700">
              Already have an account?{" "}
              <Link to="/signin" className="text-red-600 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-3 rounded-xl font-semibold transition`}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Right: Slogan */}
        <div className="hidden md:flex w-1/2 bg-blue-600 text-white items-center justify-center p-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Welcome to Connectra!</h2>
            <p className="text-lg font-light">
              Share moments, connect with friends, and be part of a vibrant community.
            </p>
            <p className="text-red-200 italic">"Your social story begins here."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
