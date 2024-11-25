import { Types } from 'mongoose';
import Appointment from '@models/appointment/appointment.model';
import Doctor from '@models/doctor/doctor.model';
import User from '@models/users/user.model';
import { isWithinWorkingHours, isValidAppointmentTime, TIME_SLOT_DURATION } from '@helpers/appointments/timeValidation';

export class AppointmentService {
  /**
   * Creates a new appointment.
   *
   * @param doctorId - The ID of the doctor.
   * @param userId - The ID of the user.
   * @param date - The date and time of the appointment.
   * @param reason - The reason for the appointment.
   * @returns A promise that resolves to the created appointment.
   * @throws Will throw an error if the doctorId or userId is invalid.
   * @throws Will throw an error if the date is invalid or conflicts with the doctor's working hours.
   * @throws Will throw an error if the user has reached their daily appointment limit.
   */
  static async createAppointment(
    doctorId: string,
    userId: string,
    date: Date,
    reason: string
  ): Promise<any> {
    await this.validateIds(doctorId, userId);
    const doctor = await this.getDoctor(doctorId);
    await this.getUser(userId);
    this.validateDate(date);
    this.validateAppointmentTime(date, doctor.workingHours);
    await this.checkConflicts(doctorId, date);
    await this.checkUserDailyLimit(userId, date);

    const appointment = new Appointment({
      doctor: doctorId,
      user: userId,
      date,
      reason,
      status: 'scheduled'
    });

    await appointment.save();

    await this.updateReferences(doctorId, userId, appointment._id);

    return appointment.populate(['doctor', 'user']);
  }



  /**
   * Retrieves the available appointment slots for a given doctor on a specific date.
   *
   * @param doctorId - The unique identifier of the doctor.
   * @param date - The date for which to retrieve available slots.
   * @returns A promise that resolves to an array of available appointment slots as Date objects.
   * @throws Will throw an error if the doctorId is invalid or if the doctor is not found.
   */
  static async getAvailableSlots(doctorId: string, date: Date): Promise<Date[]> {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new Error('ID de doctor inválido');
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor no encontrado');
    }
    doctor.workingHours = doctor.workingHours ?? { start: '09:00', end: '17:00', daysOff: [] };

    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const bookedAppointments = await this.getBookedAppointments(doctorId, startOfDay, endOfDay);

    return this.generateAvailableSlots(date, doctor.workingHours, bookedAppointments);
  }



  /**
   * Updates the status of an appointment.
   *
   * @param appointmentId - The ID of the appointment to update.
   * @param status - The new status of the appointment. Can be 'scheduled', 'completed', or 'cancelled'.
   * @returns A promise that resolves to the updated appointment, populated with doctor and user details.
   * @throws Will throw an error if the appointment ID is invalid.
   * @throws Will throw an error if the appointment is not found.
   * @throws Will throw an error if the status transition is not allowed.
   */
  static async updateAppointmentStatus(
    appointmentId: string,
    status: 'scheduled' | 'completed' | 'cancelled'
  ): Promise<any> {
    if (!Types.ObjectId.isValid(appointmentId)) {
      throw new Error('ID de cita inválido');
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error('Cita no encontrada');
    }

    // Validar cambios de estado permitidos
    const validTransitions: { [key: string]: string[] } = {
      scheduled: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[appointment.status].includes(status)) {
      throw new Error(`No se puede cambiar el estado de ${appointment.status} a ${status}`);
    }

    appointment.status = status;
    await appointment.save();

    return appointment.populate(['doctor', 'user']);
  }

  /**
   * Retrieves the appointments for a specific user.
   *
   * @param userId - The ID of the user whose appointments are to be retrieved.
   * @returns A promise that resolves to an array of appointments.
   * @throws Will throw an error if the provided userId is not a valid ObjectId.
   */
  static async getUserAppointments(userId: string): Promise<any[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('ID de usuario inválido');
    }

    return Appointment.find({ user: userId })
      .populate('doctor', 'name surname specialty')
      .sort({ date: 1 });
  }

  /**
   * Retrieves appointments for a specific doctor, optionally filtered by date and status.
   *
   * @param doctorId - The ID of the doctor whose appointments are to be retrieved.
   * @param date - (Optional) The date for which appointments are to be retrieved. If provided, only appointments on this date will be returned.
   * @param status - (Optional) The status of the appointments to be retrieved. If provided, only appointments with this status will be returned.
   * @returns A promise that resolves to an array of appointments matching the specified criteria.
   * @throws Will throw an error if the provided doctorId is not a valid ObjectId.
   */
  static async getDoctorAppointments(
    doctorId: string,
    date?: Date,
    status?: string
  ): Promise<any[]> {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new Error('ID de doctor inválido');
    }

    const query: any = { doctor: doctorId };

    if (date) {
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (status) {
      query.status = status;
    }

    return Appointment.find(query)
      .populate('user', 'name surname email telephone')
      .sort({ date: 1 });
  }

  /**
   * Cancels an appointment by its ID, providing a reason for the cancellation.
   * 
   * @param appointmentId - The unique identifier of the appointment to be cancelled.
   * @param reason - The reason for cancelling the appointment.
   * @returns A promise that resolves to the updated appointment with populated doctor and user fields.
   * @throws Will throw an error if the appointment ID is invalid, the appointment status is not valid for cancellation, or the cancellation time is not valid.
   */
  static async cancelAppointment(appointmentId: string, reason: string): Promise<any> {
    this.validateAppointmentId(appointmentId);

    const appointment = await this.findAppointmentById(appointmentId);
    this.validateAppointmentStatus(appointment);
    this.validateCancellationTime(appointment);

    appointment.status = 'cancelled';
    appointment.notes = reason;
    await appointment.save();

    return appointment.populate(['doctor', 'user']);
  }

  /**
   * Validates the given appointment ID.
   * 
   * This method checks if the provided appointment ID is a valid MongoDB ObjectId.
   * If the ID is not valid, it throws an error with the message 'ID de cita inválido'.
   * 
   * @param appointmentId - The appointment ID to validate.
   * @throws {Error} If the appointment ID is not a valid MongoDB ObjectId.
   */
  private static validateAppointmentId(appointmentId: string) {
    if (!Types.ObjectId.isValid(appointmentId)) {
      throw new Error('ID de cita inválido');
    }
  }

  /**
   * Finds an appointment by its ID.
   *
   * @param appointmentId - The ID of the appointment to find.
   * @returns The appointment if found.
   * @throws An error if the appointment is not found.
   */
  private static async findAppointmentById(appointmentId: string) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error('Cita no encontrada');
    }
    return appointment;
  }

  /**
   * Validates the status of an appointment.
   * 
   * This method checks if the appointment status is 'scheduled'. If the status is not 'scheduled',
   * it throws an error indicating that only scheduled appointments can be canceled.
   * 
   * @param appointment - The appointment object to be validated.
   * @throws {Error} If the appointment status is not 'scheduled'.
   */
  private static validateAppointmentStatus(appointment: any) {
    if (appointment.status !== 'scheduled') {
      throw new Error('Solo se pueden cancelar citas programadas');
    }
  }

  /**
   * Validates if the appointment can be canceled based on the time remaining until the appointment.
   * Throws an error if the appointment is less than 24 hours away.
   *
   * @param appointment - The appointment object containing the date of the appointment.
   * @throws {Error} If the appointment is less than 24 hours away.
   */
  private static validateCancellationTime(appointment: any) {
    const appointmentTime = appointment.date.getTime();
    const now = new Date().getTime();
    const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24) {
      throw new Error('Las citas deben cancelarse con al menos 24 horas de anticipación');
    }
  }

  /**
 * Validates the provided doctor and user IDs to ensure they are valid MongoDB ObjectIds.
 * 
 * @param doctorId - The ID of the doctor to validate.
 * @param userId - The ID of the user to validate.
 * @throws {Error} Throws an error if either the doctorId or userId is not a valid ObjectId.
 */
  private static async validateIds(doctorId: string, userId: string) {
    if (!Types.ObjectId.isValid(doctorId) || !Types.ObjectId.isValid(userId)) {
      throw new Error('ID de doctor o usuario inválido');
    }
  }

  /**
   * Retrieves a doctor by their ID and ensures they have default working hours if not already set.
   * 
   * @param doctorId - The unique identifier of the doctor to retrieve.
   * @returns A promise that resolves to the doctor object with working hours set.
   * @throws An error if the doctor is not found.
   */
  private static async getDoctor(doctorId: string) {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor no encontrado');
    }
    doctor.workingHours = doctor.workingHours ?? { start: '09:00', end: '17:00', daysOff: [] };
    return doctor;
  }

  /**
   * Retrieves a user by their ID.
   * 
   * @param userId - The ID of the user to retrieve.
   * @returns The user object if found.
   * @throws Will throw an error if the user is not found.
   */
  private static async getUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }

  /**
   * Validates that the provided date is not in the past.
   * 
   * @param date - The date to be validated.
   * @throws Will throw an error if the date is in the past.
   */
  private static validateDate(date: Date) {
    const now = new Date();
    if (date < now) {
      throw new Error('No se pueden agendar citas en el pasado');
    }
  }

  /**
   * Validates the appointment time against the specified working hours.
   *
   * @param date - The date and time of the appointment to be validated.
   * @param workingHours - The working hours within which the appointment must fall.
   * @throws Will throw an error if the appointment time is not valid or if it is outside the working hours.
   */
  private static validateAppointmentTime(date: Date, workingHours: any) {
    if (!isValidAppointmentTime(date)) {
      throw new Error(`Las citas deben agendarse en intervalos de ${TIME_SLOT_DURATION} minutos`);
    }

    if (!isWithinWorkingHours(date, workingHours)) {
      throw new Error('La hora de la cita está fuera del horario del doctor');
    }
  }

  /**
   * Checks for any conflicting appointments for a given doctor and date.
   * 
   * This method queries the database to find any scheduled appointments for the specified doctor
   * that overlap with the given date within a time slot duration. If a conflicting appointment is found,
   * an error is thrown indicating that the selected time slot is not available.
   * 
   * @param doctorId - The ID of the doctor for whom to check appointment conflicts.
   * @param date - The date and time of the appointment to check for conflicts.
   * @throws {Error} If there is a conflicting appointment within the specified time slot duration.
   * @private
   */
  private static async checkConflicts(doctorId: string, date: Date) {
    const conflictingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: {
        $gte: new Date(date.getTime() - (TIME_SLOT_DURATION * 60000)),
        $lt: new Date(date.getTime() + (TIME_SLOT_DURATION * 60000))
      },
      status: 'scheduled'
    });

    if (conflictingAppointment) {
      throw new Error('El horario seleccionado no está disponible');
    }
  }

  /**
   * Checks if the user has reached the daily limit of scheduled appointments.
   * 
   * This method counts the number of appointments a user has scheduled for a given date.
   * If the user has already scheduled 2 or more appointments for that date, an error is thrown.
   * 
   * @param userId - The ID of the user to check.
   * @param date - The date for which to check the user's scheduled appointments.
   * @throws {Error} If the user has already scheduled 2 or more appointments for the given date.
   * @private
   */
  private static async checkUserDailyLimit(userId: string, date: Date) {
    const userDailyAppointments = await Appointment.countDocuments({
      user: userId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      },
      status: 'scheduled'
    });

    if (userDailyAppointments >= 2) {
      throw new Error('No se pueden agendar más de 2 citas por día');
    }
  }

  /**
   * Updates the references for a doctor and a user by adding the appointment ID to their respective appointments array.
   *
   * @param doctorId - The ID of the doctor to update.
   * @param userId - The ID of the user to update.
   * @param appointmentId - The ID of the appointment to add to the references.
   * @returns A promise that resolves when the references have been updated.
   */
  private static async updateReferences(doctorId: string, userId: string, appointmentId: Types.ObjectId) {
    await Promise.all([
      Doctor.findByIdAndUpdate(doctorId, { $push: { appointments: appointmentId } }),
      User.findByIdAndUpdate(userId, { $push: { appointments: appointmentId } })
    ]);
  }

  /**
 * Retrieves the booked appointments for a specific doctor within a given time range.
 *
 * @param doctorId - The unique identifier of the doctor.
 * @param startOfDay - The start time of the day to filter appointments.
 * @param endOfDay - The end time of the day to filter appointments.
 * @returns A promise that resolves to an array of booked appointments.
 */
  private static async getBookedAppointments(doctorId: string, startOfDay: Date, endOfDay: Date) {
    return Appointment.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'scheduled'
    });
  }

  /**
   * Generates a list of available appointment slots for a given date, working hours, and booked appointments.
   *
   * @param date - The date for which to generate available slots.
   * @param workingHours - An object containing the start and end times of the working hours in "HH:mm" format.
   * @param bookedAppointments - An array of booked appointments, each containing a date property.
   * @returns An array of available appointment slots as Date objects.
   */
  private static generateAvailableSlots(date: Date, workingHours: any, bookedAppointments: any[]): Date[] {
    const slots: Date[] = [];
    const { start, end } = workingHours;
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const currentSlot = new Date(date);
    currentSlot.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(endHour, endMinute, 0, 0);

    while (currentSlot <= endTime) {
      if (
        isWithinWorkingHours(currentSlot, workingHours) &&
        currentSlot > new Date()
      ) {
        const isBooked = bookedAppointments.some(
          app => Math.abs(app.date.getTime() - currentSlot.getTime()) < TIME_SLOT_DURATION * 60000
        );

        if (!isBooked) {
          slots.push(new Date(currentSlot));
        }
      }
      currentSlot.setMinutes(currentSlot.getMinutes() + TIME_SLOT_DURATION);
    }

    return slots;
  }
}