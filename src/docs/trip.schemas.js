/**
 * @swagger
 * components:
 *   schemas:
 *     TripDay:
 *       type: object
 *       properties:
 *         day_number:
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
 *         - start_date
 *         - end_date
 *         - location
 *         - budget
 *       properties:
 *         image_url:
 *           type: string
 *           format: uri
 *           example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2025-08-01"
 *         end_date:
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
 *         total_cost:
 *           type: number
 *           format: float
 *           example: 2000
 *         days:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TripDay'
 *           example:
 *             - day_number: 1
 *               notes: "Visited the Eiffel Tower"
 *               cost: 150
 *             - day_number: 2
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
 *         image_url:
 *           type: string
 *           format: uri
 *           example: "https://res.cloudinary.com/demo/image/upload/updated.jpg"
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2025-08-02"
 *         end_date:
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
 *         total_cost:
 *           type: number
 *           format: float
 *           example: 2800
 *         days:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TripDay'
 *           example:
 *             - day_number: 1
 *               notes: "Colosseum tour"
 *               cost: 120
 *             - day_number: 2
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
