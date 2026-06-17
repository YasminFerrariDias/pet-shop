import z from 'zod';
import { appointmentSchema } from '../services/appointment-schema';
import { AppointmentFormSchema } from '../services/form-schema';

export type AppointmentPeriodDay = 'morning' | 'afternoon' | 'evening';

export type AppointmentData = z.infer<typeof appointmentSchema>;

export type AppointFormValues = z.infer<typeof AppointmentFormSchema>;

export type Appointment = {
  id: string;
  petName: string;
  tutorName: string;
  phone: string;
  servicesIds: string[];
  scheduleAt: Date;
  period?: AppointmentPeriodDay;
};

export type AppointmentPeriod = {
  title: string;
  type: AppointmentPeriodDay;
  timeRange: string;
  appointments: Appointment[];
};
