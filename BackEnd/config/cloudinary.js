import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// ✅ Configure Cloudinary once at startup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary and return its secure URL.
 * @param {string} filePath - Path to the local file.
 * @returns {string|null} - Secure URL of the uploaded file or null if failed.
 */
const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // auto-detect file type
      folder: "profiles", // optional: organize uploads into a folder
    });

    // ✅ Clean up local temp file after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);

    // Clean up file if upload failed
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return null;
  }
};

export default uploadOnCloudinary;