import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AppointFormValues,
  Appointment,
  AppointmentFormProps,
} from '../types/appointment';
import { format, setHours, setMinutes } from 'date-fns';
import {
  createAppointment,
  updateAppointment,
} from '../services/appointment-mutations';
import { toast } from 'sonner';
import { AppointmentFormSchema } from '../services/appointment-schema';

export function useAppointmentForm({
  appointment,
  allServices,
}: AppointmentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
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

  useEffect(() => {
    const servicesIds = form.watch('servicesIds');

    const total = servicesIds.reduce((sum: number, id: string) => {
      const service = allServices?.find((s) => s.id === id);
      return sum + (service?.duration || 0);
    }, 0);

    setTotalDuration(total);
  }, [form.watch('servicesIds'), allServices]);

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

  return {
    form,
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
