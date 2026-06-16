'use server';

import z from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { endOfDay, startOfDay } from 'date-fns';
import { validateBusinessHours } from './date';
import { checkAvailability } from './date-server';

const appointmentSchema = z.object({
  tutorName: z.string(),
  petName: z.string(),
  phone: z.string(),
  servicesIds: z.array(z.string()),
  scheduleAt: z.date(),
});

type AppointmentData = z.infer<typeof appointmentSchema>;

// VALIDAÇÃO SE EXISTE AGENDAMENTO
export async function appointmentExist(id: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
  });

  return appointment !== null;
}

// CRIAÇÃO DO AGENDAMENTO
export async function createAppointment(data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);

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

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar agendamento: ', error);
    return { error: 'Erro ao criar o agendamento' };
  }
}

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
