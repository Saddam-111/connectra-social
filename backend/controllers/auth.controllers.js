// controllers/auth.controller.js
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../config/token.js";
import { sendMail } from "../config/mail.js";

// ======================= SIGNUP =======================
export const signUp = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;

    if (!name || !userName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ success: false, message: "Email already registered" });

    const userNameExists = await User.findOne({ userName });
    if (userNameExists) return res.status(400).json({ success: false, message: "Username already taken" });

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, userName, email, password: hashedPassword });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 10 days
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(201).json({ success: true, message: "Sign up successful", user });
  } catch (error) {
    console.error("SignUp Error:", error);
    return res.status(500).json({ success: false, message: "User signup failed" });
  }
};

// ======================= SIGNIN =======================
export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ userName }).select("+password");
    if (!user) return res.status(400).json({ success: false, message: `User not found: ${userName}` });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect password" });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({ success: true, message: "Sign in successful", user });
  } catch (error) {
    console.error("SignIn Error:", error);
    return res.status(500).json({ success: false, message: "Sign in failed" });
  }
};

// ======================= SIGNOUT =======================
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("SignOut Error:", error);
    return res.status(500).json({ success: false, message: "Signout failed" });
  }
};

// ======================= SEND OTP =======================
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Always respond as if OTP sent to prevent enumeration
      return res.status(200).json({ success: true, message: "If registered, OTP sent to email" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min
    user.isOtpVerified = false;

    await user.save();
    await sendMail(email, otp);

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("SendOtp Error:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// ======================= VERIFY OTP =======================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "No account found" });
    if (user.isOtpVerified) return res.status(400).json({ success: false, message: "OTP already verified" });
    if (user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP invalid or expired" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "OTP verified. You can reset your password" });
  } catch (error) {
    console.error("VerifyOtp Error:", error);
    return res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};

// ======================= RESET PASSWORD =======================
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "No account found" });
    if (!user.isOtpVerified) return res.status(400).json({ success: false, message: "OTP verification required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;

    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successful. You can login now" });
  } catch (error) {
    console.error("ResetPassword Error:", error);
    return res.status(500).json({ success: false, message: "Password reset failed" });
  }
};
