import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (fileBuffer, folder = "uploads") => {
  const result = await cloudinary.uploader.upload_stream(
    { folder },
    (error, result) => {
      if (error) throw error;
      return result;
    }
  );

  // Since cloudinary.uploader.upload_stream uses a callback, we wrap it in a Promise:
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(fileBuffer);
  });
};

export const deleteImage = async (publicId) => {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
};
