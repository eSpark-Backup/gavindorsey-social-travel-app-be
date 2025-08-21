import axiosInstance, { limiters } from "../config/axios.js";
import { CustomError } from "../utils/custom_error.js";

const TOMTOM_BASE = "https://api.tomtom.com";
const TOMTOM_KEY = process.env.TOMTOM_API_KEY;

export const getSafetyInfo = async (lat, lon) => {
  if (!lat || !lon)
    throw new CustomError("Latitude and longitude are required", 400);

  return limiters.tomtom.schedule(async () => {
    try {
      const { data } = await axiosInstance.get(
        `${TOMTOM_BASE}/traffic/services/4/flowSegmentData/absolute/10/json`,
        { params: { point: `${lat},${lon}`, key: TOMTOM_KEY } }
      );

      return {
        trafficSpeed: data.flowSegmentData?.currentSpeed || null,
        freeFlowSpeed: data.flowSegmentData?.freeFlowSpeed || null,
        congestion:
          data.flowSegmentData?.currentSpeed <
          data.flowSegmentData?.freeFlowSpeed,
      };
    } catch (err) {
      throw new CustomError(
        "Failed to fetch safety data from TomTom",
        502,
        err
      );
    }
  });
};
