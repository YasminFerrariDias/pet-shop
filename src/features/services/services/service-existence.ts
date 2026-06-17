import { prisma } from '@/lib/prisma';

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
      serviceName,
    },
  });

  if (existingService) {
    return {
      error: 'Já existe um serviço com este nome!',
    };
  }

  return true;
}
