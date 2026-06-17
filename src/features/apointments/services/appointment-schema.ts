import z from 'zod';

export const appointmentSchema = z.object({
  tutorName: z.string(),
  petName: z.string(),
  phone: z.string(),
  servicesIds: z.array(z.string()),
  scheduleAt: z.date(),
});
