/**
 * @swagger
 * components:
 *   schemas:
 *     SignUp:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     SocialLogin:
 *       type: object
 *       required:
 *         - provider
 *         - id_token
 *       properties:
 *         provider:
 *           type: string
 *           enum: [google, apple]
 *         id_token:
 *           type: string
 */
