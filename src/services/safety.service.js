import axiosInstance, { limiters } from "../config/axios.js";
import { CustomError } from "../utils/custom_error.js";

const BASE_URL = "https://api.tomtom.com";
const SAFETY_CLIENT_API_KEY = process.env.SAFETY_CLIENT_API_KEY;

/**
 * Fetch safety-related traffic info using TomTom Flow + Incident APIs
 */
export const getSafetyInfo = async (lat, lon) => {
  if (!lat || !lon) {
    throw new CustomError("Latitude and longitude are required", 400);
  }

  return limiters.tomtom.schedule(async () => {
    try {
      // --- Traffic Flow API ---
      const flowRes = await axiosInstance.get(
        `${BASE_URL}/traffic/services/4/flowSegmentData/absolute/10/json`,
        {
          params: {
            point: `${lat},${lon}`,
            key: SAFETY_CLIENT_API_KEY,
          },
        }
      );

      const flowData = flowRes.data?.flowSegmentData || null;

      const trafficInfo = {
        trafficSpeed: flowData?.currentSpeed ?? null,
        freeFlowSpeed: flowData?.freeFlowSpeed ?? null,
        travelTimeInSeconds: flowData?.currentTravelTime ?? null,
        freeFlowTravelTimeInSeconds: flowData?.freeFlowTravelTime ?? null,
        confidence: flowData?.confidence ?? null,
        roadClosure: flowData?.roadClosure ?? false,
        congestion:
          flowData?.currentSpeed != null &&
          flowData?.freeFlowSpeed != null &&
          flowData.currentSpeed < flowData.freeFlowSpeed,
      };

      // --- Traffic Incidents API ---
      let incidents = [];
      try {
        // create a bounding box around lat/lon (~0.05° in each direction)
        const delta = 0.05;
        const bbox = `${lat - delta},${lon - delta},${lat + delta},${
          lon + delta
        }`;

        const incidentRes = await axiosInstance.get(
          `${BASE_URL}/traffic/services/5/incidentDetails`,
          {
            params: {
              bbox,
              fields:
                "{incidents{type,geometry{type,coordinates},properties{eventCode,iconCategory,magnitudeOfDelay,startTime,endTime,from,to,length,delay,roadNumber,roadType}}}",
              key: SAFETY_CLIENT_API_KEY,
            },
          }
        );

        incidents = incidentRes.data?.incidents || [];
      } catch (incidentErr) {
        console.warn(
          "[Traffic Incidents API] Warning:",
          incidentErr.response?.data || incidentErr.message
        );
        incidents = [];
      }

      return {
        ...trafficInfo,
        incidents,
      };
    } catch (err) {
      const details = err.response?.data || err.message;
      throw new CustomError(
        "Failed to fetch safety data from TomTom",
        502,
        details
      );
    }
  });
};
