import React, { useState } from "react";
import { Eye, EyeOff, Mail, Key, CheckCircle } from "lucide-react";
import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate()
  const handleSendOtp = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await axios.post(`${baseUrl}/api/auth/sendOtp`, { email });
      setSuccess(resp.data.message || "OTP sent!");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await axios.post(`${baseUrl}/api/auth/verifyOtp`, { email, otp });
      setSuccess(resp.data.message || "OTP verified!");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const resp = await axios.post(`${baseUrl}/api/auth/resetPassword`, {
        email,
        password: newPassword,
      });
      setSuccess(resp.data.message || "Password reset successful!");
      setStep(1);
      setEmail(""); setOtp(""); setNewPassword(""); setConfirmPassword("");
      navigate('/signin')
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Reset Password"}
        </h1>

        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        {success && <p className="mb-4 text-green-500 text-center">{success}</p>}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div className="relative">
              <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div className="relative">
              <Key className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="relative">
              <Key className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <div
                className="absolute top-3 right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <div className="relative">
              <Key className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          </form>
        )}

        <button
          onClick={
            step === 1 ? handleSendOtp :
            step === 2 ? handleVerifyOtp :
            handleResetPassword
          }
          disabled={loading}
          className={`mt-6 w-full py-3 font-semibold rounded-xl text-white transition ${
            loading ? "bg-gray-400" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500"
          }`}
        >
          {step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Reset Password"}
        </button>

        <div className="mt-4 text-center text-gray-500">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="underline hover:text-gray-700"
            >
              Go Back
            </button>
          )}
        </div>

        {step === 3 && success && (
          <div className="mt-4 flex items-center justify-center gap-2 text-green-600 font-semibold">
            <CheckCircle size={20} />
            <span>Password successfully reset!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
