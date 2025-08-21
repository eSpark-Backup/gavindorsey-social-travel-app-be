import axios from "axios";
import Bottleneck from "bottleneck";
import { HTTP_TIMEOUT, HTTP_RETRIES, RATE_LIMITS } from "./constants.js";
import { CustomError } from "../utils/custom_error.js";

// Create axios instance with defaults
const axiosInstance = axios.create({
  timeout: HTTP_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

// Format axios errors into CustomError consistently
const formatAxiosError = (error) => {
  if (error.response) {
    // Server responded with an error status
    return new CustomError(
      "external_api_error",
      error.response.status || 502,
      error.response.statusText || "External API error",
      { data: error.response.data }
    );
  } else if (error.request) {
    // Request was sent but no response received
    return new CustomError(
      "no_response",
      504,
      "No response from external API",
      { request: error.config }
    );
  } else {
    // Something went wrong before sending the request
    return new CustomError(
      "axios_request_setup_failed",
      500,
      String(error.message || "Axios request setup failed"),
      { originalError: error }
    );
  }
};

// Interceptor: retry logic with exponential backoff
axiosInstance.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config || config.__retryCount >= HTTP_RETRIES) {
    throw formatAxiosError(error);
  }

  config.__retryCount = (config.__retryCount || 0) + 1;
  const delay = Math.pow(2, config.__retryCount) * 100; // exponential backoff
  await new Promise((res) => setTimeout(res, delay));
  return axiosInstance(config);
});

// Per-provider rate limiters
export const limiters = {
  mapbox: new Bottleneck(RATE_LIMITS.MAPBOX),
  openweather: new Bottleneck(RATE_LIMITS.OPENWEATHER),
  tomtom: new Bottleneck(RATE_LIMITS.TOMTOM),
};

export default axiosInstance;
