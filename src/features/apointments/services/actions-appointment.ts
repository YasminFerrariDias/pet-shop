'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { endOfDay, startOfDay } from 'date-fns';
import { validateBusinessHours } from './date';
import { checkAvailability } from './date-server';
import { appointmentSchema } from './appointment-schema';
import { AppointmentData } from '../types/appointment';
import { appointmentExist } from './appointment-schema.server';

// ATUALIZAÇÃO DO AGENDAMENTO
export async function updateAppointment(id: string, data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const validation = validateBusinessHours(parsedData.scheduleAt);
    if (!validation.valid) return validation;

    const exists = await appointmentExist(id);
    if (!exists) return { error: 'Agendamento não encontrado' };

    const conflict = await checkAvailability(
      parsedData.scheduleAt,
      parsedData.servicesIds,
      id
    );

    if (!conflict.valid) return conflict;

    await prisma.appointment.update({
      where: { id },
      data: parsedData,
    });

    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar o agendamento: ', error);
    return { error: 'Erro ao atualizar o agendamento' };
  }
}

export async function deleteAppointment(id: string) {
  try {
    const exists = await appointmentExist(id);
    if (!exists) return { error: 'Agendamento não encontrado' };

    await prisma.appointment.delete({
      where: { id },
    });

    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return {
      error: 'Erro ao remover agendamento. Tente novamente',
    };
  }
}

export async function getAppointmentByDate(date: Date) {
  const start = startOfDay(date);
  const end = endOfDay(date);

  const appointments = await prisma.appointment.findMany({
    where: {
      scheduleAt: {
        gte: start,
        lte: end,
      },
    },
    orderBy: {
      scheduleAt: 'asc',
    },
  });

  return appointments;
}
