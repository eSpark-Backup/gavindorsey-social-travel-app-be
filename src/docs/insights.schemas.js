/**
 * @swagger
 * components:
 *   schemas:
 *     InsightRequest:
 *       type: object
 *       required:
 *         - lat
 *         - lon
 *       properties:
 *         lat:
 *           type: number
 *           example: 37.7749
 *         lon:
 *           type: number
 *           example: -122.4194
 *         days:
 *           type: integer
 *           description: Number of forecast days (default is 7, max 16)
 *           example: 7
 *
 *     TripInsightRequest:
 *       type: object
 *       required:
 *         - tripId
 *       properties:
 *         tripId:
 *           type: string
 *           format: uuid
 *           example: "3d6f0a8c-fc4b-4f28-9d4f-cf154d4b2c9b"
 *
 *     InsightResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Insights fetched successfully
 *         data:
 *           type: object
 *           properties:
 *             current_weather:
 *               type: object
 *               additionalProperties: true
 *             forecast:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties: true
 *             travel_time:
 *               type: object
 *               properties:
 *                 duration:
 *                   type: number
 *                   description: Estimated travel time in minutes
 *                 distance:
 *                   type: number
 *                   description: Estimated travel distance in kilometers
 *             points_of_interest:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties: true
 */
