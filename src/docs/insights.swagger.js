/**
 * @swagger
 * tags:
 *   name: Insights
 *   description: Endpoints for retrieving weather, travel, and location-based insights
 */

/**
 * @swagger
 * /api/insights:
 *   get:
 *     summary: Get insights for a specific location
 *     tags: [Insights]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the location
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the location
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *           maximum: 16
 *         required: false
 *         description: Number of forecast days (max 16)
 *     responses:
 *       200:
 *         description: Insights fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InsightResponse'
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/insights/trip/{tripId}:
 *   get:
 *     summary: Get insights for a saved trip
 *     tags: [Insights]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of the trip
 *     responses:
 *       200:
 *         description: Trip insights fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InsightResponse'
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Server error
 */
