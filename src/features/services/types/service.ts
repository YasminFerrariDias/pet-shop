import z from 'zod';
import { serviceSchema } from '../services/service-schema';

export type ServiceData = z.infer<typeof serviceSchema>;

export type Service = {
  id: string;
  serviceName: string;
  duration: number;
  price: number;
};

export type ServiceFormProps = {
  service?: Service;
  children?: React.ReactNode;
};
