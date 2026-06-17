import { prisma } from '@/lib/prisma';

// VALIDAÇÃO SE EXISTE AGENDAMENTO
export async function appointmentExist(id: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
  });

  return appointment !== null;
}
