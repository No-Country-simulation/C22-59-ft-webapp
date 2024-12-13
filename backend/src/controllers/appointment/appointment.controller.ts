import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '@services/appointment/appointment.service';
import { HttpResponse } from '@helpers/error/validation.error';

const httpResponse = new HttpResponse();

class AppointmentController {
  async createAppointment(req: Request, res: Response) {
    try {
      const { doctor, user, date, reason, status, time, notes } = req.body;
      const appointment = await AppointmentService.createAppointment({
        doctorId: doctor,
        userId: user,
        date,
        reason,
        status,
        time,
        notes,
      });
      httpResponse.Ok(res, appointment);
    } catch (error: any) {
      httpResponse.Error(res, error.message || 'Error creating appointment');
    }
  }

  async getAvailableSlots(req: Request, res: Response) {
    try {
      const { doctorId, date } = req.query;
      if (!doctorId || !date) {
        httpResponse.BadRequest(res, 'Doctor ID and date are required');
      }
      const slots = await AppointmentService.getAvailableSlots(
        doctorId as string,
        new Date(date as string)
      );
      httpResponse.Ok(res, slots);
    } catch (error: any) {
      httpResponse.Error(res, error.message || 'Error fetching available slots');
    }
  }

  async updateAppointmentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const appointment = await AppointmentService.updateAppointmentStatus(id, status);
      httpResponse.Ok(res, appointment);
    } catch (error: any) {
      httpResponse.Error(res, error.message || 'Error updating appointment status');
    }
  }

  async getUserAppointments(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const appointments = await AppointmentService.getUserAppointments(userId);
      httpResponse.Ok(res, appointments);
    } catch (error: any) {
      httpResponse.Error(res, error.message || 'Error fetching user appointments');
    }
  }

  async getDoctorAppointments(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const { date, status } = req.query;

      const appointments = await AppointmentService.getDoctorAppointments(
        doctorId,
        date ? new Date(date as string) : undefined,
        status as string | undefined
      );
      httpResponse.Ok(res, appointments);
    } catch (error: any) {
      httpResponse.Error(res, error.message || 'Error fetching doctor appointments');
    }
  }

  async cancelAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const appointment = await AppointmentService.cancelAppointment(id, reason);
      httpResponse.Ok(res, appointment);
    } catch (error: any) {
      httpResponse.Error(res, error.message || 'Error cancelling appointment');
    }
  }
}

export default new AppointmentController();