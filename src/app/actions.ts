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

export async function validadeAppointment(scheduleAt: Date) {
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

export async function createAppointment(data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);
    const { scheduleAt } = parsedData;

    validadeAppointment(parsedData.scheduleAt);

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

    await prisma?.appointment.create({
      data: {
        ...parsedData,
      },
    });

    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.log(error);

    return {
      error: 'Erro ao criar o agendamento',
    };
  }
}

export async function updateAppointment(id: string, data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);
    const { scheduleAt } = parsedData;

    validadeAppointment(parsedData.scheduleAt);

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

    await prisma?.appointment.create({
      data: {
        ...parsedData,
      },
    });

    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.log(error);

    return {
      error: 'Erro ao criar o agendamento',
    };
  }
}

export async function deleteAppointment(id: string) {
  try {
    await prisma.appointment.delete({
      where: {
        id,
      },
    });

    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return {
      error: 'Erro ao remover agendamento. Tente novamente',
    };
  }
}
