'use server';

import { addMinutes, endOfDay, startOfDay } from 'date-fns';
import { prisma } from '@/lib/prisma';
import {
  getServiceDuration,
  validateBusinessHours,
  validateEndTime,
} from './date';

export async function checkAvailability(
  scheduleAt: Date,
  serviceIds: string[],
  excludeId?: string
) {
  const businessHoursValidation = validateBusinessHours(scheduleAt);

  if (!businessHoursValidation.valid) {
    return businessHoursValidation;
  }

  const duration = await getServiceDuration(serviceIds);

  const endTimeValidation = validateEndTime(scheduleAt, duration);
  const endTime = addMinutes(scheduleAt, duration);

  if (!endTimeValidation.valid) {
    return endTimeValidation;
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
      return { valid: false, error: 'Já existe um agendamento neste horário' };
    }
  }

  return { valid: true };
}
