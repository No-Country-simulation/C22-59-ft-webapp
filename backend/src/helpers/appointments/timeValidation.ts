export const TIME_SLOT_DURATION = 30; // minutes

export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const parseTimeString = (time: string): { hours: number; minutes: number } => {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
};

export const isWithinWorkingHours = (
  date: Date,
  workingHours: { start: string; end: string; daysOff: string[] }
): boolean => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[date.getDay()];

  if (workingHours.daysOff.includes(dayName)) {
    return false;
  }

  const { hours: startHours, minutes: startMinutes } = parseTimeString(workingHours.start);
  const { hours: endHours, minutes: endMinutes } = parseTimeString(workingHours.end);

  const appointmentHours = date.getHours();
  const appointmentMinutes = date.getMinutes();

  const startTime = startHours * 60 + startMinutes;
  const endTime = endHours * 60 + endMinutes;
  const appointmentTime = appointmentHours * 60 + appointmentMinutes;

  return appointmentTime >= startTime && appointmentTime <= endTime;
};

export const isValidAppointmentTime = (date: Date): boolean => {
  return date.getMinutes() % TIME_SLOT_DURATION === 0;
};
