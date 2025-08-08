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

const router = express.Router();

router.use(authenticate);

router.post("/", validate(createTripSchema), create);
router.get("/", list);
router.get("/:trip_id", getById);
router.put("/:trip_id", validate(updateTripSchema), update);
router.delete("/:trip_id", remove);

export { router as tripRoutes };
