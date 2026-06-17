'use server';

import { checkAvailability } from './date-server';
import { validateBusinessHours } from './date';
import { AppointmentFormSchema } from './form-schema';
import { AppointmentData } from '../types/appointment';
import { prisma } from '@/lib/prisma';

// CRIAÇÃO DO AGENDAMENTO
export async function createAppointment(data: AppointmentData) {
  try {
    const parsedData = AppointmentFormSchema.parse(data);

    const validation = validateBusinessHours(parsedData.scheduleAt);
    if (!validation.valid) return validation;

    const conflict = await checkAvailability(
      parsedData.scheduleAt,
      parsedData.servicesIds
    );
    if (!conflict.valid) return conflict;

    await prisma?.appointment.create({
      data: {
        ...parsedData,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao criar agendamento: ', error);
    return { error: 'Erro ao criar o agendamento' };
  }
}
