import { CustomError } from "../utils/custom_error.js";

const parseJsonArraysMiddleware = (req, res, next) => {
  try {
    if (req.body.days && typeof req.body.days === "string") {
      req.body.days = JSON.parse(req.body.days);
      if (!Array.isArray(req.body.days)) {
        throw new Error('"days" must be an array');
      }
    }

    if (req.body.markers && typeof req.body.markers === "string") {
      req.body.markers = JSON.parse(req.body.markers);
      if (!Array.isArray(req.body.markers)) {
        throw new Error('"markers" must be an array');
      }
    }

    next();
  } catch (err) {
    next(
      new CustomError(err.message || "Invalid JSON in days or markers", 422)
    );
  }
};

export { parseJsonArraysMiddleware };
