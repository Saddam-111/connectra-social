import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "3d" });
    return token;
  } catch (error) {
    console.error("Token generation error:", error);
    throw new Error("Token generation failed");
  }
};
