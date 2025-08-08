import { CustomError } from "../utils/custom_error.js";

const parseDaysMiddleware = (req, res, next) => {
  if (req.body.days && typeof req.body.days === "string") {
    try {
      req.body.days = JSON.parse(req.body.days);
      if (!Array.isArray(req.body.days)) {
        throw new Error();
      }
    } catch {
      return next(new CustomError('"days" must be a valid JSON array', 422));
    }
  }
  next();
};

export { parseDaysMiddleware };
