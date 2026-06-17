import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AppointFormValues, Appointment } from '../types/appointment.type';
import { format } from 'date-fns';

export function useFormReset({
  form,
  appointment,
}: {
  form: UseFormReturn<AppointFormValues>;
  appointment?: Appointment;
}) {
  useEffect(() => {
    if (appointment) {
      form.reset({
        tutorName: appointment.tutorName,
        petName: appointment.petName,
        phone: appointment.phone,
        servicesIds: appointment.servicesIds || [],
        scheduleAt: appointment.scheduleAt,
        time: format(appointment.scheduleAt, 'HH:mm'),
      });
    } else {
      form.reset({
        tutorName: '',
        petName: '',
        phone: '',
        servicesIds: [],
        scheduleAt: undefined,
        time: '',
      });
    }
  }, [appointment, form]);
}
