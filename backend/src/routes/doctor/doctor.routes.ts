import {Router} from "express";
import {
	createDoctor,
	getDoctorById,
	getDoctors,
	updateDoctor,
	deleteDoctorById,
	loginDoctor,
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
 *         - specialty
 *         - licenseNumber
 *         - password
 *         - telephone
 *         - workingHours
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
 *         specialty:
 *           type: string
 *           description: DOCTOR's specialty
 *         licenseNumber:
 *           type: string
 *           description: DOCTOR's license number
 *         password:
 *           type: string
 *           description: DOCTOR's password (minimum 8 characters)
 *         telephone:
 *           type: string
 *           description: DOCTOR's primary phone number
 *         workingHours:
 *           type: object
 *           description: DOCTOR's working hours
 *           properties:
 *             start:
 *               type: string
 *               description: DOCTOR's working hours start
 *             end:
 *               type: string
 *               description: DOCTOR's working hours end
 *             daysOff:
 *               type: array
 *               description: DOCTOR's working hours days off
 *               items:
 *                 type: string
 *                 description: DOCTOR's working hours days off
 *       example:
 *         name: "doctorCristian"
 *         surname: "Machuca"
 *         nationalId: "1234567890"
 *         email: "doctorCristian@gmail.com"
 *         specialty: "Cardiologist"
 *         licenseNumber: "12345678"
 *         password: "12345678"
 *         telephone: "+123456789"
 *         workingHours: {
 *           start: "09:00",
 *           end: "21:00",
 *           daysOff: ["Monday", "Friday"]
 *         }
 *     DoctorLogin:
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
 *     RegistrationDoctor:
 *       type: object
 *       required:
 *         - name
 *         - surname
 *         - nationalId
 *         - email
 *         - specialty
 *         - licenseNumber
 *         - password
 *         - telephone
 *       properties:
 *         name:
 *           type: string
 *           description: DOCTOR's name.
 *         surname:
 *           type: string
 *           description: DOCTOR's surname.
 *         nationalId:
 *           type: string
 *           description: DOCTOR's national id.
 *         email:
 *           type: string
 *           description: DOCTOR's email.
 *         specialty:
 *           type: string
 *           description: DOCTOR's specialty.
 *         licenseNumber:
 *           type: string
 *           description: DOCTOR's license number.
 *         password:
 *           type: string
 *           description: DOCTOR's password.
 *         telephone:
 *           type: string
 *           description: DOCTOR's telephone.
 *       example:
 *         name: "Cristian"
 *         surname: "Machuca"
 *         nationalId: "123456789"
 *         email: "doctorCristian@gmail.com"
 *         specialty: "Cardiologist"
 *         licenseNumber: "123456789"
 *         password: "12345678"
 *         telephone: "123456789"
 *
 * /api/doctors/auth/register:
 *   post:
 *     summary: Create a new DOCTOR
 *     security:
 *       - bearerAuth: []
 *     tags: [DOCTOR]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationDoctor'
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
router.post("/doctors/auth/register", validateToken, createDoctor);

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
 *             $ref: '#/components/schemas/DoctorLogin'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorLogin'
 *       500:
 *         description: Error when LOGGING IN DOCTOR
 */
router.post("/doctors/auth/login", loginDoctor);

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

export default router;
