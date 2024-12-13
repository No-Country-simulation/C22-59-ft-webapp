import { WorkingHours } from "@interfaces/appointment";
import moment from "moment";

export const TIME_SLOT_DURATION = 30;

export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const isValidAppointmentTime = (date: Date): boolean => {
  return date.getMinutes() % TIME_SLOT_DURATION === 0;
}

/**
 * Checks if a given date is within the specified working hours.
 *
 * @param date - The date to check.
 * @param workingHours - An object containing the working hours and days off.
 * @param workingHours.start - The start time of the working hours in 'HH:mm' format.
 * @param workingHours.end - The end time of the working hours in 'HH:mm' format.
 * @param workingHours.daysOff - An array of days (e.g., 'Monday', 'Tuesday') that are considered days off.
 * @returns `true` if the date is within the working hours and not on a day off, otherwise `false`.
 */
export const isWithinWorkingHours = (
  date: Date,
  workingHours: WorkingHours
): boolean => {
  const momentDate = moment(date);
  const dayName = moment(momentDate).format('dddd');
  if (workingHours.daysOff.map(d => d.toLowerCase()).includes(dayName.toLowerCase())) {
    return false;
  }
  const startTime = moment(workingHours.start, 'HH:mm').hours() * 60 + moment(workingHours.start, 'HH:mm').minutes();
  const endTime = moment(workingHours.end, 'HH:mm').hours() * 60 + moment(workingHours.end, 'HH:mm').minutes();
  const appointmentTime = momentDate.hours() * 60 + momentDate.minutes();
  return appointmentTime >= startTime && appointmentTime <= endTime;
};