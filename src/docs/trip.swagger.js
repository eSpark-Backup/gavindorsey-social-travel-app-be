/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Trip management endpoints
 */

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateTrip'
 *     responses:
 *       201:
 *         description: Trip created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get paginated list of trips for the authenticated user
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [createdAt, startDate, endDate, budget, totalCost]
 *           default: createdAt
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trips fetched successfully
 */

/**
 * @swagger
 * /api/trips/{tripId}:
 *   parameters:
 *     - in: path
 *       name: tripId
 *       required: true
 *       schema:
 *         type: string
 *       description: Trip ID
 *
 *   get:
 *     summary: Get trip details by ID
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Trip fetched successfully
 *       404:
 *         description: Trip not found
 *
 *   put:
 *     summary: Update an existing trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTrip'
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Trip not found
 *
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 */

/**
 * @swagger
 * /api/trips/marker/place:
 *   post:
 *     summary: Place markers on a trip map (with or without search)
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               markers:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TripMarker'
 *     responses:
 *       200:
 *         description: Markers placed successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Trip not found
 */
