import {Router} from "express";
import {
	createDoctor,
	getDoctorById,
	getDoctors,
	updateDoctor,
	deleteDoctorById,
} from "@controllers/doctor/doctor.ctrl";
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
 *     IDoctor:
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
 *           description: DOCTOR's first name
 *         surname:
 *           type: string
 *           description: DOCTOR's last name
 *         nationalId:
 *           type: string
 *           description: DOCTOR's national identification number
 *         email:
 *           type: string
 *           format: email
 *           description: DOCTOR's email address
 *         password:
 *           type: string
 *           description: DOCTOR's password (minimum 8 characters)
 *         telephone:
 *           type: string
 *           description: DOCTOR's primary phone number
 *       example:
 *         name: "doctorCristian"
 *         surname: "Machuca"
 *         nationalId: "1234567890"
 *         email: "doctorCristian@gmail.com"
 *         password: "12345678"
 *         telephone: "+123456789"
 *
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: DOCTOR's email.
 *         password:
 *           type: string
 *           description: DOCTOR's password.
 *       example:
 *         email: "doctorCristian@gmail.com"
 *         password: "12345678"
 *
 *
 * /api/doctors/auth/register:
 *   post:
 *     summary: Create a new DOCTOR
 *     security: []
 *     tags: [DOCTOR]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IDoctor'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDoctor'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating the DOCTOR
 */
router.post("/doctors/auth/register",validateToken, createDoctor);

/**
 * @swagger
 * /api/doctors/auth/login:
 *   post:
 *     security: []
 *     summary: Login DOCTOR
 *     tags: [DOCTOR]
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
 *         description: Error when LOGGING IN DOCTOR
 */
router.post("/doctors/auth/login", getDoctorById);

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all DOCTORS
 *     tags: [DOCTOR]
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *
 *       404:
 *          description: Not Found
 *
 *       500:
 *         description: Error when fetching DOCTORS
 */
router.get("/doctors", validateToken, getDoctors);

/**
 * @swagger
 * /api/doctors/{id}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get the DOCTOR selected if registered.
 *     tags: [DOCTOR]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: DOCTOR fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Register'
 *       404:
 *         description: DOCTOR not found
 *       500:
 *         description: Error fetching DOCTOR
 */
router.get("/doctors/:id", validateToken, getDoctorById);

/**
 * @swagger
 * /api/doctors/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete the DOCTOR selected if registered.
 *     tags: [DOCTOR]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The DOCTOR's id.
 *     responses:
 *       200:
 *         description: Success
 *
 *       500:
 *         description: Error when deleting DOCTOR
 */
router.delete("/doctors/:id", validateToken, deleteDoctorById);

/**
 * @swagger
 * /api/doctors/{id}:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     summary: Update the DOCTOR selected if registered.
 *     tags: [DOCTOR]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The DOCTOR's id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IDoctor'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDoctor'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Not Found
 *       500:
 *         description: Error when updating DOCTOR
 */
router.put("/doctors/:id", validateToken, updateDoctor);

export default router;