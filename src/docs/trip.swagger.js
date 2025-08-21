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
 *         application/json:
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
 *         description: Page number (minimum 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of trips per page
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [created_at, start_date, end_date, location, budget, total_cost]
 *           default: created_at
 *         description: Field to sort by
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by location keyword
 *     responses:
 *       200:
 *         description: Trips fetched successfully
 */

/**
 * @swagger
 * /api/trips/{trip_id}:
 *   get:
 *     summary: Get trip details by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip fetched successfully
 *       404:
 *         description: Trip not found
 */

/**
 * @swagger
 * /api/trips/{trip_id}:
 *   put:
 *     summary: Update an existing trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTrip'
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Trip not found
 */

/**
 * @swagger
 * /api/trips/{trip_id}:
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 */
