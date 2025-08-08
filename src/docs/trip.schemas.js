/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTrip:
 *       type: object
 *       required:
 *         - start_date
 *         - end_date
 *         - location
 *         - budget
 *       properties:
 *         image:
 *           type: string
 *           format: binary
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         location:
 *           type: string
 *         budget:
 *           type: number
 *           format: float
 *         total_cost:
 *           type: number
 *           format: float
 *         days:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day_number:
 *                 type: integer
 *               notes:
 *                 type: string
 *               cost:
 *                 type: number
 *                 format: float
 *     UpdateTrip:
 *       type: object
 *       properties:
 *         image:
 *           type: string
 *           format: binary
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         location:
 *           type: string
 *         budget:
 *           type: number
 *           format: float
 *         total_cost:
 *           type: number
 *           format: float
 *         days:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day_number:
 *                 type: integer
 *               notes:
 *                 type: string
 *               cost:
 *                 type: number
 *                 format: float
 */
