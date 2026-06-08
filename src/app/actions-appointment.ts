'use server';

import z from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { addMinutes, startOfMinute } from 'date-fns';

const appointmentSchema = z.object({
  tutorName: z.string(),
  petName: z.string(),
  phone: z.string(),

  scheduleAt: z.date(),
});

type AppointmentData = z.infer<typeof appointmentSchema>;

// VALIDAÇÃO DO HORÁRIO
export async function validateAppointment(scheduleAt: Date) {
  const now = new Date();
  if (scheduleAt <= now) {
    return {
      error: 'O horário não pode ser no passado',
    };
  }

  const hour = scheduleAt.getHours();
  const minute = scheduleAt.getMinutes();

  const isValidTime =
    (hour >= 9 && hour < 12) ||
    (hour === 12 && minute === 0) ||
    (hour >= 13 && hour < 18) ||
    (hour === 18 && minute === 0) ||
    (hour >= 19 && hour < 21) ||
    (hour === 21 && minute === 0);

  if (!isValidTime) {
    return {
      error:
        'Agendamentos só podem ser feitos entre 9h e 12h, 13h e 18h ou 19h e 21h',
    };
  }

  return true;
}

// VALIDAÇÃO SE EXISTE ALGUM NO MESMO HORÁRIO
export async function existenceQuery(scheduleAt: Date) {
  const existingAppointment = await prisma?.appointment.findFirst({
    where: {
      scheduleAt: {
        gte: startOfMinute(scheduleAt),
        lte: addMinutes(startOfMinute(scheduleAt), 1),
      },
    },
  });

  if (existingAppointment) {
    return {
      error: 'Este horário já está reservado',
    };
  }

  return true;
}

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

    const validation = await validateAppointment(parsedData.scheduleAt);
    if (validation !== true) return validation;

    const conflict = await existenceQuery(parsedData.scheduleAt);
    if (conflict !== true) return conflict;

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

    const validation = await validateAppointment(parsedData.scheduleAt);
    if (validation !== true) return validation;

    const existingAppointment = await prisma?.appointment.findFirst({
      where: {
        scheduleAt: parsedData.scheduleAt,
        id: { not: id },
      },
    });

    const exists = await appointmentExist(id);
    if (!exists) return { error: 'Agendamento não encontrado' };

    if (existingAppointment) {
      return { error: 'Este horário já está reservado' };
    }

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
