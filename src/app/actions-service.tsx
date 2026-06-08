'use server';

import z from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const serviceSchema = z.object({
  serviceName: z.string(),
  duration: z.string(),
  price: z.string(),
});

type ServiceData = z.infer<typeof serviceSchema>;

// VALIDAÇÃO SE EXISTE SERVIÇO
export async function serviceExist(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
  });

  return service !== null;
}

// VALIDAÇÃO SE EXISTE ALGUM COMO MESMO NOME
export async function existenceQuery(serviceName: string) {
  const existingService = await prisma?.service.findFirst({
    where: {
      serviceName
    },
  });

  if (existingService) {
    return {
      error: 'Já existe um serviço com este nome!',
    };
  }

  return true;
}

// CRIAÇÃO DO AGENDAMENTO
export async function createService(data: ServiceData) {
  try {
    const parsedData = serviceSchema.parse(data);

    const conflict = await existenceQuery(parsedData.serviceName);
    if (conflict !== true) return conflict;

    await prisma?.service.create({
      data: {
        serviceName: parsedData.serviceName,
        duration: parsedData.duration,
        price: parsedData.price,
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar cadastro: ', error);
    return { error: 'Erro ao criar o cadastro' };
  }
}

// ATUALIZAÇÃO DO AGENDAMENTO
export async function updateService(id: string, data: ServiceData) {
  try {
    const parsedData = serviceSchema.parse(data);

    const existingService = await prisma?.service.findFirst({
      where: {
        serviceName: parsedData.serviceName,
        id: { not: id },
      },
    });

    const exists = await serviceExist(id);
    if (!exists) return { error: 'Serviço não encontrado' };

    if (existingService) {
      return { error: 'Já existe um serviço com este horário!' };
    }

    await prisma.service.update({
      where: { id },
      data: {
        serviceName: parsedData.serviceName,
        duration: parsedData.duration,
        price: parsedData.price,
      },
    });

    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar o serviço: ', error);
    return { error: 'Erro ao atualizar o serviço' };
  }
}


export async function deleteService(id: string) {
  try {
    const exists = await serviceExist(id);
    if (!exists) return { error: 'Serviço não encontrado' };

    await prisma.service.delete({
      where: { id },
    });

    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return {
      error: 'Erro ao remover o serviço. Tente novamente',
    };
  }
}
