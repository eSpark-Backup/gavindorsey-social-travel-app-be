const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;

  console.error("[ERROR]", {
    path: req.originalUrl,
    method: req.method,
    status,
    message: err.message,
    details: err.details || err.errors || err.stack,
  });

  // Friendly message for client
  let message;
  switch (status) {
    case 400:
      message = err.message || "Bad request. Please check your input.";
      break;
    case 401:
      message = err.message || "Unauthorized. Please log in again.";
      break;
    case 403:
      message =
        err.message || "Forbidden. You don't have access to this resource.";
      break;
    case 404:
      message = err.message || "Resource not found.";
      break;
    case 429:
      message = err.message || "Too many requests. Please try again later.";
      break;
    case 502:
      message =
        err.message || "Upstream service error. Please try again later.";
      break;
    default:
      message = err.message || "Internal server error. Please try again later.";
  }

  res.status(status).json({
    success: false,
    message,
    details: err.details || err.errors || null, // ✅ add this
    data: null,
  });
};

export { errorHandler };
