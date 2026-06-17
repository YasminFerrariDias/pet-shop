'use server';

import { prisma } from '@/lib/prisma';
import { endOfDay, startOfDay } from 'date-fns';

// VALIDAÇÃO SE EXISTE AGENDAMENTO
export async function appointmentExist(id: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
  });

  return appointment !== null;
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

export async function getAppointments() {
  return await prisma.appointment.findMany({
    orderBy: { scheduleAt: 'asc' },
  });
}
