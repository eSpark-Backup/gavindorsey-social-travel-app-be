import dotenv from "dotenv";
dotenv.config();
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import jwt from "jsonwebtoken";
import * as jose from "jose"; // For Apple JWK handling
import { CustomError } from "./custom_error.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (id_token) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return {
      email: payload.email,
      firstName: payload.given_name || "",
      lastName: payload.family_name || "",
    };
  } catch (err) {
    throw new CustomError("Invalid Google token", 401);
  }
};

const verifyAppleToken = async (id_token) => {
  try {
    const decoded = jwt.decode(id_token, { complete: true });
    if (!decoded) {
      throw new CustomError("Invalid Apple token", 401);
    }

    const appleKeys = await axios.get("https://appleid.apple.com/auth/keys");
    const key = appleKeys.data.keys.find((k) => k.kid === decoded.header.kid);
    if (!key) {
      throw new CustomError("Apple public key not found", 401);
    }

    const publicKey = await jose.importJWK(key, "RS256");
    await jose.jwtVerify(id_token, publicKey, { algorithms: ["RS256"] });

    return {
      email: decoded.payload.email || "",
      firstName: "",
      lastName: "",
    };
  } catch (err) {
    throw new CustomError("Invalid Apple token", 401);
  }
};

export { verifyGoogleToken, verifyAppleToken };
