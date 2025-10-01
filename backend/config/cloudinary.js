import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Configure Cloudinary once, not inside the function
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadCloudinary = async (file) => {
  try {
    if (!file) throw new Error("No file provided");

    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto"
    });

    // Safely delete temp file
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }

    return result;
  } catch (error) {
    // Still try to clean up file even if error occurred
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload to Cloudinary");
  }
};
