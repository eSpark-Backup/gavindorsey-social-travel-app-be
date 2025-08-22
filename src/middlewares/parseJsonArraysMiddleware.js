import { CustomError } from "../utils/custom_error.js";

const parseJsonArraysMiddleware = (req, res, next) => {
  try {
    const normalizeToArray = (value, key) => {
      if (!value) return value;

      // If passed as string, try parsing
      if (typeof value === "string") {
        value = JSON.parse(value);
      }

      // Wrap single object into array
      if (!Array.isArray(value)) {
        value = [value];
      }

      return value;
    };

    if (req.body.days) {
      req.body.days = normalizeToArray(req.body.days, "days");
    }

    if (req.body.markers) {
      req.body.markers = normalizeToArray(req.body.markers, "markers");
    }

    next();
  } catch (err) {
    next(
      new CustomError(
        "parsing_error",
        422,
        err.message || "Invalid JSON in days or markers"
      )
    );
  }
};

export { parseJsonArraysMiddleware };
