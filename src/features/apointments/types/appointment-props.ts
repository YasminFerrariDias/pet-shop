import { Service } from '@/features/services/types/service';
import { Appointment } from './appointment';

export type AppointmentFormProps = {
  appointment?: Appointment;
  children?: React.ReactNode;
  allServices?: Service[];
};
