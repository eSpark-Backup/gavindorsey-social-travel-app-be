import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "default_jwt_secret"; // Replace in production
const expiresIn = "7d";

const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

export { generateToken, verifyToken };
