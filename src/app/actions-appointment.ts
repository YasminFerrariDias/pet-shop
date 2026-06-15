'use server';

import z from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { addMinutes, endOfDay, startOfDay } from 'date-fns';

const appointmentSchema = z.object({
  tutorName: z.string(),
  petName: z.string(),
  phone: z.string(),
  servicesIds: z.array(z.string()),
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

export async function checkAvailability(
  scheduleAt: Date,
  serviceIds: string[],
  excludeId?: string
) {
  if (!serviceIds || serviceIds.length === 0) {
    return true;
  }

  const services = await prisma.service.findMany({
    where: {
      id: {
        in: serviceIds,
      },
    },
  });

  const totalDuration = services.reduce((sum, service) => {
    return (sum = sum + service.duration);
  }, 0);

  const endTime = addMinutes(scheduleAt, totalDuration);
  const hour = endTime.getHours();
  const minute = endTime.getMinutes();

  const startAppointment = scheduleAt.getHours();
  const totalEndMinutes = hour * 60 + minute;

  const limitMorning = 12 * 60;
  const limitAfternoon = 18 * 60;
  const limitEverning = 21 * 60;

  if (startAppointment >= 9 && startAppointment < 12) {
    if (totalEndMinutes > limitMorning) {
      return {
        error:
          'O agendamento não pode ultrapassar o horário de almoço (12h às 13h)',
      };
    }
  } else if (startAppointment >= 13 && startAppointment < 18) {
    if (totalEndMinutes > limitAfternoon) {
      return {
        error:
          'O agendamento não pode ultrapassar o intervalo do jantar (18h às 19h)',
      };
    }
  } else if (startAppointment >= 19 && startAppointment < 21) {
    if (totalEndMinutes > limitEverning) {
      return {
        error:
          'O agendamento não pode ultrapassar o horário de fechamento (21h)',
      };
    }
  }

  const idEndTimeValid =
    (hour >= 9 && hour < 12) ||
    (hour === 12 && minute === 0) ||
    (hour >= 13 && hour < 18) ||
    (hour === 18 && minute === 0) ||
    (hour >= 19 && hour < 21) ||
    (hour === 21 && minute === 0);

  if (!idEndTimeValid) {
    if (hour >= 12 && hour < 13) {
      return {
        error:
          'Horário de término não pode ser no horário de almoço (12h às 13h)',
      };
    }

    if (hour >= 18 && hour < 19) {
      return {
        error:
          'Horário de término não pode ser no intervalo do jantar (18h às 19h)',
      };
    }

    if (hour >= 21 && (hour === 21 || minute > 0)) {
      return {
        error: 'Horário de término ultrapassa o horário de fechamento (21h)',
      };
    }
    return { error: 'Horário de término inválido' };
  }

  const startOfTheDay = startOfDay(scheduleAt);
  const endOfTheDay = endOfDay(scheduleAt);

  const dailyAppointments = await prisma.appointment.findMany({
    where: {
      scheduleAt: {
        gte: startOfTheDay,
        lte: endOfTheDay,
      },
      ...(excludeId && { id: { not: excludeId } }),
    },
  });

  for (const apt of dailyAppointments) {
    const aptServices = await prisma.service.findMany({
      where: { id: { in: apt.servicesIds } },
    });

    const aptDuration = aptServices.reduce((sum, s) => sum + s.duration, 0);

    const aptEndTime = addMinutes(apt.scheduleAt, aptDuration);

    const hasConflict = scheduleAt < aptEndTime && endTime > apt.scheduleAt;

    if (hasConflict) {
      return { error: 'Já existe um agendamento neste horário' };
    }
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

    const conflict = await checkAvailability(
      parsedData.scheduleAt,
      parsedData.servicesIds
    );

    if (conflict && typeof conflict === 'object' && 'error' in conflict) {
      return conflict;
    }

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

    const exists = await appointmentExist(id);
    if (!exists) return { error: 'Agendamento não encontrado' };

    const conflict = await checkAvailability(
      parsedData.scheduleAt,
      parsedData.servicesIds,
      id
    );
    if (conflict !== true) return conflict;

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
