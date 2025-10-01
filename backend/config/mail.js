import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host:  "smtp.gmail.com", 
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER || process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Avoid Render SSL issues
  },
});

/**
 * Send OTP Email
 * @param {string} to - Recipient email
 * @param {string} otp - OTP code
 */
export const sendMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Connectra Support" <${process.env.EMAIL_USER || process.env.EMAIL}>`,
      to,
      subject: "Reset Your Password",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      html: `
        <p>
          Your OTP for password reset is <b>${otp}</b>.<br />
          It will expire in <b>5 minutes</b>.
        </p>
      `,
    });

    console.log("OTP email sent to:", to);
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    throw new Error("Failed to send OTP email");
  }
};
