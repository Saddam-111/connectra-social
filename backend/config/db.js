import mongoose from "mongoose";


export const dbConnect = async (req , res) => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected")
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}