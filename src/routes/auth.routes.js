import express from "express";
import { signUp, login, socialLogin } from "../controllers/auth.controller.js";
import {
  signUpSchema,
  loginSchema,
  socialLoginSchema,
} from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.post("/signup", validate(signUpSchema), signUp);
router.post("/login", validate(loginSchema), login);
router.post("/social-login", validate(socialLoginSchema), socialLogin);

export { router as authRoutes };
