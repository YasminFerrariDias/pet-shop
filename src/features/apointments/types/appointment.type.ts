import z from 'zod';
import { AppointmentFormSchema, appointmentSchema } from './appointment.schema';
import { Service } from '@/features/services/types/service.type';

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

export type AppointmentFormProps = {
  appointment?: Appointment;
  children?: React.ReactNode;
  allServices?: Service[];
};
