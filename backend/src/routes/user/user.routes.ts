import {Router} from "express";
import {validateToken} from "@helpers/token/token.validator";
import {
	createUser,
	loginUser,
	getUsers,
	getUserById,
	deleteUserById,
} from "@controllers/users/user.ctrl";
import {isAdministrator} from "@middlewares/administrator/administrator.mw";
import {isDoctor} from "@middlewares/doctor/doctor.mw";
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
 *     IUser:
 *       type: object
 *       required:
 *         - birthday
 *         - name
 *         - surname
 *         - nationalId
 *         - email
 *         - password
 *         - telephone
 *         - blood
 *         - gender
 *       properties:
 *         birthday:
 *           type: string
 *           format: date
 *           description: USER's date of birth (YYYY-MM-DD)
 *         name:
 *           type: string
 *           description: USER's first name
 *         surname:
 *           type: string
 *           description: USER's last name
 *         nationalId:
 *           type: string
 *           description: USER's national identification number
 *         email:
 *           type: string
 *           format: email
 *           description: USER's email address
 *         password:
 *           type: string
 *           description: USER's password (minimum 8 characters)
 *         telephone:
 *           type: string
 *           description: USER's primary phone number
 *         optionalTelephone:
 *           type: string
 *           description: USER's optional phone number
 *         blood:
 *           type: string
 *           description: USER's blood type
 *         gender:
 *           type: string
 *           description: USER's gender
 *           enum:
 *             - Masculino
 *             - Femenino
 *             - Otro
 *       example:
 *         birthday: "1990-01-01"
 *         name: "Cristian"
 *         surname: "Machuca"
 *         nationalId: "1234567890"
 *         email: "cristian@gmail.com"
 *         password: "12345678"
 *         telephone: "+123456789"
 *         optionalTelephone: "+987654321"
 *         blood: "O+"
 *         gender: "Masculino"
 *
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: USER's email.
 *         password:
 *           type: string
 *           description: USER's password.
 *       example:
 *         email: "cristian@gmail.com"
 *         password: "12345678"
 *
 *
 * /api/users/auth/register:
 *   post:
 *     summary: Create a new USER
 *     security: []
 *     tags: [USER]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IUser'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IUser'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating the USER
 */

router.post("/users/auth/register", createUser);

/**
 * @swagger
 * /api/users/auth/login:
 *   post:
 *     security: []
 *     summary: Login USER
 *     tags: [USER]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       500:
 *         description: Error when LOGGING IN USER
 */
router.post("/users/auth/login", isAdministrator, isDoctor, loginUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all USERS
 *     tags: [USER]
 *     responses:
 *       200:
 *         description: Success
 *
 *       404:
 *          description: Not Found
 *
 *       500:
 *         description: Error when fetching USERS
 */
router.get("/users", validateToken, getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get the USER selected if registered.
 *     tags: [USER]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: USER fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Register'
 *       404:
 *         description: USER not found
 *       500:
 *         description: Error fetching USER
 */
router.get("/users/:id", validateToken, getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete the USER selected if registered.
 *     tags: [USER]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The USER's id.
 *     responses:
 *       200:
 *         description: Success
 *
 *       500:
 *         description: Error when deleting USER
 */
router.delete("/users/:id", validateToken, deleteUserById);

export default router;
