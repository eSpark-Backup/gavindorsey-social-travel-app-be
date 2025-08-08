import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadImage = async (filePath, folder = "uploads") => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  fs.unlinkSync(filePath);
  return { url: result.secure_url, public_id: result.public_id };
};

export const deleteImage = async (publicId) => {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
};
