'use server';

import z from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { calculatePeriod, formatDateTime } from '@/utils';

const appointmentSchema = z.object({
  tutorName: z.string(),
  petName: z.string(),
  phone: z.string(),
  description: z.string(),
  scheduleAt: z.date(),
});

type AppointmentData = z.infer<typeof appointmentSchema>;

// VALIDAÇÃO DO HORÁRIO
export async function validateAppointment(scheduleAt: Date) {
  const hour = parseInt(formatDateTime(scheduleAt));

  const { isMorning, isAfternoon, isEvening } = calculatePeriod(hour);

  if (!isMorning && !isAfternoon && !isEvening) {
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
      scheduleAt,
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
