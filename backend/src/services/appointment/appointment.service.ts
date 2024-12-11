import { Types } from 'mongoose';
import Appointment from '@models/appointment/appointment.model';
import Doctor from '@models/doctor/doctor.model';
import User from '@models/users/user.model';
import { isWithinWorkingHours, isValidAppointmentTime, TIME_SLOT_DURATION } from '@helpers/appointments/timeValidation';
import moment from 'moment';
import {IAppointment} from "@interfaces/appointment";

export class AppointmentService {
	static async createAppointment(
		createAppointmentDTO: IAppointment
	): Promise<any> {
		const {
			doctorId,
			userId,
			date: dateDTO,
			time,
			notes,
			reason,
		} = createAppointmentDTO;
		await this.validateIds(doctorId, userId);
		const doctor = await this.getDoctor(doctorId);
		await this.getUser(userId);
		let date = this.validateDate(dateDTO, time);
		this.validateAppointmentTime(date, doctor.workingHours);
		await this.checkConflicts(doctorId, date);
		await this.checkUserDailyLimit(userId, date);
		const appointment = new Appointment({
			doctor: doctorId,
			user: userId,
			date: `${dateDTO} ${time}`,
			reason,
			notes,
			status: "scheduled",
		});
		await appointment.save();
		await this.updateReferences(doctorId, userId, appointment._id);
		return appointment;
	}

	static async getAvailableSlots(
		doctorId: string,
		date: Date
	): Promise<Date[]> {
		if (!Types.ObjectId.isValid(doctorId)) {
			throw new Error("ID de doctor inválido");
		}

		const doctor = await Doctor.findById(doctorId);
		if (!doctor) {
			throw new Error("Doctor no encontrado");
		}
		doctor.workingHours = doctor.workingHours ?? {
			start: "09:00",
			end: "17:00",
			daysOff: [],
		};

		const startOfDay = moment(date).startOf("day").add(1, "days").toDate();
		const endOfDay = moment(date).endOf("day").add(1, "days").toDate();

		const bookedAppointments = await this.getBookedAppointments(
			doctorId,
			startOfDay,
			endOfDay
		);

		return this.generateAvailableSlots(
			date,
			doctor.workingHours,
			bookedAppointments
		);
	}

	static async updateAppointmentStatus(
		appointmentId: string,
		status: "scheduled" | "completed" | "cancelled"
	): Promise<any> {
		if (!Types.ObjectId.isValid(appointmentId)) {
			throw new Error("ID de cita inválido");
		}

		const appointment = await Appointment.findById(appointmentId);
		if (!appointment) {
			throw new Error("Cita no encontrada");
		}

		// Validar cambios de estado permitidos
		const validTransitions: {[key: string]: string[]} = {
			scheduled: ["completed", "cancelled"],
			completed: [],
			cancelled: [],
		};

		if (!validTransitions[appointment.status].includes(status)) {
			throw new Error(
				`No se puede cambiar el estado de ${appointment.status} a ${status}`
			);
		}

		appointment.status = status;
		await appointment.save();

		return appointment;
	}

	static async getUserAppointments(userId: string): Promise<any[]> {
		if (!Types.ObjectId.isValid(userId)) {
			throw new Error("ID de usuario inválido");
		}

		return Appointment.find({user: userId})
			.populate("doctor", "name surname specialty")
			.sort({date: 1});
	}

	static async getDoctorAppointments(
		doctorId: string,
		date?: Date,
		status?: string
	): Promise<any[]> {
		if (!Types.ObjectId.isValid(doctorId)) {
			throw new Error("ID de doctor inválido");
		}

		const query: any = {doctor: doctorId};

		if (date) {
			date.setDate(date.getDate() + 1);
			const startOfDay = new Date(date.setHours(0, 0, 0, 0));
			const endOfDay = new Date(date.setHours(23, 59, 59, 999));
			query.date = {$gte: startOfDay, $lte: endOfDay};
		}

		if (status) {
			query.status = status;
		}

		return Appointment.find(query)
			.populate("user", "name surname email telephone")
			.sort({date: 1});
	}

	static async cancelAppointment(
		appointmentId: string,
		reason: string
	): Promise<any> {
		this.validateAppointmentId(appointmentId);

		const appointment = await this.findAppointmentById(appointmentId);
		this.validateAppointmentStatus(appointment);
		this.validateCancellationTime(appointment);

		appointment.status = "cancelled";
		appointment.notes = reason;
		await appointment.save();

		return appointment.populate(["doctor", "user"]);
	}

	private static validateAppointmentId(appointmentId: string) {
		if (!Types.ObjectId.isValid(appointmentId)) {
			throw new Error("ID de cita inválido");
		}
	}

	private static async findAppointmentById(appointmentId: string) {
		const appointment = await Appointment.findById(appointmentId);
		if (!appointment) {
			throw new Error("Cita no encontrada");
		}
		return appointment;
	}

	private static validateAppointmentStatus(appointment: any) {
		if (appointment.status !== "scheduled") {
			throw new Error("Solo se pueden cancelar citas programadas");
		}
	}

	private static validateCancellationTime(appointment: any) {
		const appointmentTime = appointment.date.getTime();
		const now = new Date().getTime();
		const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);

		if (hoursUntilAppointment < 24) {
			throw new Error(
				"Las citas deben cancelarse con al menos 24 horas de anticipación"
			);
		}
	}

	private static async validateIds(doctorId: string, userId: string) {
		if (!Types.ObjectId.isValid(doctorId) || !Types.ObjectId.isValid(userId)) {
			throw new Error("ID de doctor o usuario inválido");
		}
	}

	private static async getDoctor(doctorId: string) {
		const doctor = await Doctor.findById(doctorId);
		if (!doctor) {
			throw new Error("Doctor no encontrado");
		}
		doctor.workingHours = doctor.workingHours ?? {
			start: "09:00",
			end: "17:00",
			daysOff: [],
		};
		return doctor;
	}

	private static async getUser(userId: string) {
		const user = await User.findById(userId);
		if (!user) {
			throw new Error("Usuario no encontrado");
		}
		return user;
	}

	private static validateDate(date: string, time: string) {
		console.log(date);
		console.log(time);
		const appointmentDate = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");
		if (!appointmentDate.isValid()) {
			throw new Error("Fecha y hora de la cita no válidas");
		}
		if (appointmentDate.isBefore(moment())) {
			throw new Error("No se pueden agendar citas en el pasado");
		}
		return appointmentDate.toDate();
	}

	private static validateAppointmentTime(date: Date, workingHours: any) {
		if (!isValidAppointmentTime(date)) {
			throw new Error(
				`Las citas deben agendarse en intervalos de ${TIME_SLOT_DURATION} minutos`
			);
		}

		if (!isWithinWorkingHours(date, workingHours)) {
			throw new Error("La hora de la cita está fuera del horario del doctor");
		}
	}

	private static async checkConflicts(doctorId: string, date: Date) {
		const conflictingAppointment = await Appointment.findOne({
			doctor: doctorId,
			date: {
				$gte: new Date(date.getTime() - (TIME_SLOT_DURATION - 1) * 60000),
				$lt: new Date(date.getTime() + TIME_SLOT_DURATION * 60000),
			},
			status: "scheduled",
		});

		console.log(conflictingAppointment);
		if (conflictingAppointment) {
			throw new Error("El horario seleccionado no está disponible");
		}
	}

	private static async checkUserDailyLimit(userId: string, date: Date) {
		const userDailyAppointments = await Appointment.countDocuments({
			user: userId,
			date: {
				$gte: new Date(date.setHours(0, 0, 0, 0)),
				$lt: new Date(date.setHours(23, 59, 59, 999)),
			},
			status: "scheduled",
		});

		if (userDailyAppointments >= 2) {
			throw new Error("No se pueden agendar más de 2 citas por día");
		}
	}

	private static async updateReferences(
		doctorId: string,
		userId: string,
		appointmentId: Types.ObjectId
	) {
		await Promise.all([
			Doctor.findByIdAndUpdate(doctorId, {
				$push: {appointments: appointmentId},
			}),
			User.findByIdAndUpdate(userId, {$push: {appointments: appointmentId}}),
		]);
	}

	private static async getBookedAppointments(
		doctorId: string,
		startOfDay: Date,
		endOfDay: Date
	) {
		return Appointment.find({
			doctor: doctorId,
			date: {$gte: startOfDay, $lte: endOfDay},
			status: "scheduled",
		});
	}

	private static generateAvailableSlots(
		date: Date,
		workingHours: any,
		bookedAppointments: any[]
	): Date[] {
		const slots: any[] = [];
		const {start, end} = workingHours;
		const [startHour, startMinute] = start.split(":").map(Number);
		const [endHour, endMinute] = end.split(":").map(Number);

		const currentSlot = new Date(date);
		currentSlot.setDate(date.getDate() + 1);
		currentSlot.setHours(startHour, startMinute, 0, 0);

		const endTime = new Date(date);
		endTime.setDate(date.getDate() + 1);
		endTime.setHours(endHour, endMinute, 0, 0);

		while (currentSlot <= endTime) {
			if (
				isWithinWorkingHours(currentSlot, workingHours) &&
				currentSlot > new Date()
			) {
				const isBooked = bookedAppointments.some(
					(app) =>
						Math.abs(app.date.getTime() - currentSlot.getTime()) <
						TIME_SLOT_DURATION * 60000
				);

				if (!isBooked) {
					const dateFormattedBogota = moment
						.tz(currentSlot, "America/Bogota")
						.format("YYYY-MM-DD HH:mm");
					slots.push(dateFormattedBogota);
				}
			}
			currentSlot.setMinutes(currentSlot.getMinutes() + TIME_SLOT_DURATION);
		}

		return slots;
	}
}