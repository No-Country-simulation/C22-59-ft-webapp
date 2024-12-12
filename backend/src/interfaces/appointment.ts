export interface WorkingHours {
  start: string; // Formato HH:mm
  end: string; // Formato HH:mm
  daysOff: string[]; // Ejemplo: ['Sunday', 'Saturday']
}

export interface IAppointment {
  date: string; // Formato YYYY-MM-DD
  time: string; // Formato HH:mm
  status: string;
  doctorId: string;
  userId: string;
  reason?: string;
  notes?: string;
}