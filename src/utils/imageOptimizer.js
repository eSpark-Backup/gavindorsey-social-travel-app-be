import sharp from "sharp";
import fs from "fs";

/**
 * Optimize image before upload
 * @param {string} filePath - Path to the image file
 * @param {object} options - Resize & quality options
 * @returns {Promise<string>} - Path to optimized image
 */
export const optimizeImage = async (filePath, options = {}) => {
  const { width = 800, height = null, quality = 80 } = options;

  const optimizedPath = filePath.replace(/(\.[\w]+)$/, "_optimized$1");

  await sharp(filePath)
    .resize(width, height, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality, progressive: true })
    .toFile(optimizedPath);

  fs.unlinkSync(filePath); // Remove original file to save space

  return optimizedPath;
};
