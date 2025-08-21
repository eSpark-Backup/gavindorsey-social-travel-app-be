class CustomError extends Error {
  constructor(
    code,
    statusCode = 400,
    message = "An error occurred",
    details = {}
  ) {
    super(message);
    this.code = code || "internal_error";
    this.statusCode = statusCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Handles axios or HTTP errors and wraps them in CustomError
   * @param {Error} err
   * @param {string} fallbackMessage
   * @returns {CustomError}
   */
  static handleAxiosError(err, fallbackMessage = "Request failed") {
    if (err.response) {
      // Server responded with a status outside 2xx
      return new CustomError(
        err.response.data?.code || "external_service_error",
        err.response.status,
        err.response.data?.message || fallbackMessage,
        { responseData: err.response.data }
      );
    } else if (err.request) {
      // Request made but no response received
      return new CustomError(
        "no_response",
        504,
        "No response received from the external service",
        { request: err.config }
      );
    } else {
      // Something happened before sending the request
      return new CustomError(
        "request_setup_error",
        500,
        err.message || fallbackMessage
      );
    }
  }
}

export { CustomError };
