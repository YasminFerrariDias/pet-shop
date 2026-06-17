import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AppointFormValues,
  Appointment,
  AppointmentFormProps,
} from '../types/appointment';
import { setHours, setMinutes } from 'date-fns';
import {
  createAppointment,
  updateAppointment,
} from '../services/appointment-mutations';
import { toast } from 'sonner';
import { AppointmentFormSchema } from '../services/appointment-schema';
import { useTotalDuration } from './useTotalDuration';
import { useFormReset } from './useFormReset';

export function useAppointmentForm({
  appointment,
  allServices,
}: AppointmentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dayAppointments, setDayAppointments] = useState<Appointment[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<AppointFormValues>({
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: {
      tutorName: '',
      petName: '',
      phone: '',
      servicesIds: [],
      scheduleAt: undefined,
      time: '',
    },
  });

  const { totalDuration } = useTotalDuration({ allServices, form });

  const onSubmit = async (data: AppointFormValues) => {
    const [hour, minute] = data.time.split(':');

    const scheduleAt = setMinutes(
      setHours(data.scheduleAt, Number(hour)),
      Number(minute)
    );

    const isEdit = !!appointment?.id;

    const result = isEdit
      ? await updateAppointment(appointment.id, {
          ...data,
          scheduleAt,
        })
      : await createAppointment({
          ...data,
          scheduleAt,
        });

    if ('error' in result) {
      toast.error(result.error);
      return;
    }

    toast.success(
      `Agendamento ${isEdit ? 'atualizado' : 'criado'} com sucesso!`
    );

    setIsOpen(false);
    form.reset();
  };

  useFormReset({ form, appointment });

  return {
    form,
    allServices,
    isOpen,
    setIsOpen,
    onSubmit,
    totalDuration,
    dayAppointments,
    setDayAppointments,
    errorMessage,
    setErrorMessage,
  };
}
