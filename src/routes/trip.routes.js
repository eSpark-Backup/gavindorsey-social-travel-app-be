import express from "express";
import {
  create,
  list,
  getById,
  update,
  remove,
} from "../controllers/trip.controller.js";
import {
  createTripSchema,
  updateTripSchema,
} from "../validators/trip.validator.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import { parseDaysMiddleware } from "../middlewares/parseDaysMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  upload.single("image"),
  parseDaysMiddleware,
  validate(createTripSchema),
  create
);
router.get("/", list);
router.get("/:trip_id", getById);
router.put(
  "/:trip_id",
  upload.single("image"),
  parseDaysMiddleware,
  validate(updateTripSchema),
  update
);
router.delete("/:trip_id", remove);

export { router as tripRoutes };
