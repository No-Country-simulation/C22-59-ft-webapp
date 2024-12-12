import {Router} from "express";
import {
	createAdministrator,
	loginAdministrator,
} from "@controllers/administrator/administrator.ctrl";
import {validateToken} from "@helpers/token/token.validator";

const router = Router();
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       description: Provide your JWT token
 *
 *   schemas:
 *     IAdministrator:
 *       type: object
 *       required:
 *         - name
 *         - surname
 *         - nationalId
 *         - email
 *         - password
 *         - telephone
 *       properties:
 *         name:
 *           type: string
 *           description: ADMINISTRATOR's first name
 *         surname:
 *           type: string
 *           description: ADMINISTRATOR's last name
 *         nationalId:
 *           type: string
 *           description: ADMINISTRATOR's national identification number
 *         email:
 *           type: string
 *           format: email
 *           description: ADMINISTRATOR's email address
 *         password:
 *           type: string
 *           description: ADMINISTRATOR's password (minimum 8 characters)
 *         telephone:
 *           type: string
 *           description: ADMINISTRATOR's primary phone number
 *       example:
 *         name: "administratorCristian"
 *         surname: "Machuca"
 *         nationalId: "1234567890"
 *         email: "administratorCristian@gmail.com"
 *         password: "12345678"
 *         telephone: "+123456789"
 *
 *     AdminLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: ADMINISTRATOR's email.
 *         password:
 *           type: string
 *           description: ADMINISTRATOR's password.
 *       example:
 *         email: "administratorCristian@gmail.com"
 *         password: "12345678"
 * /api/administrator:
 *   post:
 *     security:
 *        - bearerAuth: []
 *     summary: Create a new ADMINISTRATOR
 *     tags: [ADMINISTRATOR]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IAdministrator'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IAdministrator'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error creating the ADMINISTRATOR
 */
router.post("/administrator", validateToken, createAdministrator);
/**
 * @swagger
 * /api/administrator/auth/login:
 *   post:
 *     summary: Login ADMINISTRATOR
 *     tags: [ADMINISTRATOR]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLogin'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminLogin'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Error when LOGGING IN ADMINISTRATOR
 */
router.post("/administrator/auth/login", loginAdministrator);

export default router;
