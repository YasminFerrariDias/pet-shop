import { prisma } from '@/lib/prisma';

export async function getServices() {
  return await prisma.service.findMany({
    orderBy: { serviceName: 'asc' },
  });
}
