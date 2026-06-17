'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { validateBusinessHours } from './appointment-date';
import { checkAvailability } from './appointment-date-server';
import {
  AppointmentFormSchema,
  appointmentSchema,
} from '../types/appointment.schema';
import { AppointmentData } from '../types/appointment.type';
import { appointmentExist } from './appointment-queries';

// CRIAÇÃO DO AGENDAMENTO
export async function createAppointment(data: AppointmentData) {
  try {
    console.log(data);
    const parsedData = AppointmentFormSchema.parse(data);

    const validation = validateBusinessHours(parsedData.scheduleAt);
    if (!validation.valid) return validation;

    const conflict = await checkAvailability(
      parsedData.scheduleAt,
      parsedData.servicesIds
    );
    if (!conflict.valid) return conflict;
    const { time, ...rest } = parsedData;
    await prisma?.appointment.create({
      data: {
        ...rest,
      },
    });

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
