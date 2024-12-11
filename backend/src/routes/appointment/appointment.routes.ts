import { Router } from 'express';
import AppointmentController from '@controllers/appointment/appointment.controller';
import { validateRequest } from '@middlewares/validateRequest';
import { appointmentSchema } from '@helpers/appointments/schema.validator';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: APPOINTMENTS
 *   description: Gestión de citas médicas
 */

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Crear una nueva cita
 *     tags: [APPOINTMENTS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor:
 *                 type: string
 *                 description: ID del doctor
 *                 example: "674444c504d490b9f61bc41e"
 *               user:
 *                 type: string
 *                 description: ID del usuario
 *                 example: "6744448f04d490b9f61bc419"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la cita (formato YYYY-MM-DD)
 *                 example: "2024-11-28"
 *               time:
 *                 type: string
 *                 format: time
 *                 description: Hora de la cita (formato HH:mm)
 *                 example: "11:30"
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 description: Estado de la cita
 *                 example: "scheduled"
 *               reason:
 *                 type: string
 *                 description: Motivo de la cita
 *                 example: "Dolor estomacal"
 *               notes:
 *                 type: string
 *                 description: Notas adicionales sobre la cita
 *                 example: "Nauseas y mareos"
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 */
router.post('/', validateRequest(appointmentSchema), AppointmentController.createAppointment);

/**
 * @swagger
 * /api/appointments/available-slots:
 *   get:
 *     summary: Obtener horarios disponibles para un doctor en una fecha específica
 *     tags: [APPOINTMENTS]
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del doctor
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha para verificar horarios disponibles
 *     responses:
 *       200:
 *         description: Lista de horarios disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Faltan parámetros obligatorios
 */
router.get('/available-slots', AppointmentController.getAvailableSlots);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   patch:
 *     summary: Actualizar el estado de una cita
 *     tags: [APPOINTMENTS]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 description: Nuevo estado de la cita
 *     responses:
 *       200:
 *         description: Estado de la cita actualizado exitosamente
 *       400:
 *         description: Error al actualizar el estado
 */
router.patch('/:id/status', AppointmentController.updateAppointmentStatus);

/**
 * @swagger
 * /api/appointments/user/{userId}:
 *   get:
 *     summary: Obtener todas las citas de un usuario
 *     tags: [APPOINTMENTS]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de citas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Error en la solicitud
 */
router.get('/user/:userId', AppointmentController.getUserAppointments);

/**
 * @swagger
 * /api/appointments/doctor/{doctorId}:
 *   get:
 *     summary: Obtener todas las citas de un doctor
 *     tags: [APPOINTMENTS]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del doctor
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para filtrar citas
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, completed, cancelled]
 *         description: Estado de las citas a filtrar
 *     responses:
 *       200:
 *         description: Lista de citas del doctor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Error en la solicitud
 */
router.get('/doctor/:doctorId', AppointmentController.getDoctorAppointments);

/**
 * @swagger
 * /api/appointments/{id}/cancel:
 *   post:
 *     summary: Cancelar una cita
 *     tags: [APPOINTMENTS]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la cita a cancelar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Motivo de la cancelación
 *     responses:
 *       200:
 *         description: Cita cancelada exitosamente
 *       400:
 *         description: Error al cancelar la cita
 */
router.post('/:id/cancel', AppointmentController.cancelAppointment);

export default router;