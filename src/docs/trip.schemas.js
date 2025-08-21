/**
 * @swagger
 * components:
 *   schemas:
 *     TripDay:
 *       type: object
 *       properties:
 *         dayNumber:
 *           type: integer
 *           example: 1
 *         notes:
 *           type: string
 *           example: "Visited the Eiffel Tower"
 *         cost:
 *           type: number
 *           format: float
 *           example: 150.5
 *
 *     TripMarker:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Eiffel Tower"
 *         lat:
 *           type: number
 *           format: float
 *           example: 48.8584
 *         lon:
 *           type: number
 *           format: float
 *           example: 2.2945
 *
 *     CreateTrip:
 *       type: object
 *       required:
 *         - title
 *         - startDate
 *         - endDate
 *         - location
 *         - budget
 *         - image
 *       properties:
 *         image:
 *           type: string
 *           format: binary
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2025-08-01"
 *         endDate:
 *           type: string
 *           format: date
 *           example: "2025-08-10"
 *         location:
 *           type: string
 *           example: "Paris, France"
 *         budget:
 *           type: number
 *           format: float
 *           example: 2500
 *         totalCost:
 *           type: number
 *           format: float
 *           example: 2000
 *         days:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TripDay'
 *           example:
 *             - dayNumber: 1
 *               notes: "Visited the Eiffel Tower"
 *               cost: 150
 *             - dayNumber: 2
 *               notes: "Louvre Museum tour"
 *               cost: 100
 *         markers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TripMarker'
 *           example:
 *             - name: "Eiffel Tower"
 *               lat: 48.8584
 *               lon: 2.2945
 *
 *     UpdateTrip:
 *       type: object
 *       properties:
 *         image:
 *           type: string
 *           format: binary
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2025-08-02"
 *         endDate:
 *           type: string
 *           format: date
 *           example: "2025-08-12"
 *         location:
 *           type: string
 *           example: "Rome, Italy"
 *         budget:
 *           type: number
 *           format: float
 *           example: 3000
 *         totalCost:
 *           type: number
 *           format: float
 *           example: 2800
 *         days:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TripDay'
 *           example:
 *             - dayNumber: 1
 *               notes: "Colosseum tour"
 *               cost: 120
 *             - dayNumber: 2
 *               notes: "Vatican City visit"
 *               cost: 200
 *         markers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TripMarker'
 *           example:
 *             - name: "Colosseum"
 *               lat: 41.8902
 *               lon: 12.4922
 */
