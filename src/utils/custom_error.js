export class CustomError extends Error {
  constructor(
    code = "internal_error",
    statusCode = 500,
    message,
    details = {}
  ) {
    // Fallback message based on status
    const defaultMessage =
      {
        400: "Bad request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Resource not found",
        422: "Unprocessable entity",
        500: "Internal server error",
      }[statusCode] || "An error occurred";

    super(message || defaultMessage);

    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  static handleAxiosError(err, fallbackMessage = "Request failed") {
    if (err.response) {
      return new CustomError(
        err.response.data?.code || "external_service_error",
        err.response.status,
        err.response.data?.message || fallbackMessage,
        { responseData: err.response.data }
      );
    } else if (err.request) {
      return new CustomError(
        "no_response",
        504,
        "No response received from the external service",
        { request: err.config }
      );
    } else {
      return new CustomError(
        "request_setup_error",
        500,
        err.message || fallbackMessage
      );
    }
  }
}
