import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignIn = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [data, setData] = useState({
    userName: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);

  const togglePassword = () => setShowPassword(!showPassword);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/signin`,
        data,
        { withCredentials: true }
      );
      dispatch(setUserData(response.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Sign in failed. Please try again.");
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
            Welcome Back to Connectra
          </h2>

          <form className="space-y-5" onSubmit={onSignIn}>
            <div>
              <label className="block text-blue-800 font-medium">Username</label>
              <input
                type="text"
                name="userName"
                value={data.userName}
                onChange={onChangeHandler}
                placeholder="Your username"
                className="w-full p-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-blue-800 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={onChangeHandler}
                  placeholder="Enter password"
                  className="w-full p-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  disabled={loading}
                />
                <div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-600 cursor-pointer"
                  onClick={togglePassword}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
              <div className="text-right mt-2">
                <Link to="/forgot-password" className="text-sm text-red-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <p className="text-sm text-center text-gray-700">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-red-600 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-3 rounded-xl font-semibold transition`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Right: Message */}
        <div className="hidden md:flex w-1/2 bg-blue-600 text-white items-center justify-center p-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Welcome Back!</h2>
            <p className="text-lg font-light">
              Connect, explore, and share your world on Connectra.
            </p>
            <p className="text-red-200 italic">"Dive back into your social universe."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
