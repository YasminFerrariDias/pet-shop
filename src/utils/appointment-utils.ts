import { AppointmentModel as AppointmentPrisma } from '@/generated/prisma/models';
import {
  Appointment,
  AppointmentPeriod,
  AppointmentPeriodDay,
} from '@/types/appointment';

export const getPeriod = (hour: number): AppointmentPeriodDay | null => {
  if (hour >= 9 && hour <= 12) return 'morning';
  if (hour >= 13 && hour <= 18) return 'afternoon';
  if (hour >= 19 && hour <= 21) return 'evening';

  return null;
};

export function groupAppointmentByPeriod(
  Appointments: AppointmentPrisma[]
): AppointmentPeriod[] {
  const transformedAppointments: Appointment[] = Appointments?.map((apt) => {
    const period = getPeriod(apt.scheduleAt.getHours());
    if (!period) return null;

    return {
      ...apt,
      time: formatDateTime(apt.scheduleAt),
      // MUDAR
      description: apt.description,
      period,
    };
  }).filter((item): item is Appointment => item !== null);

  const morningAppointments = transformedAppointments.filter(
    (apt) => apt.period === 'morning'
  );
  const afternoonAppointments = transformedAppointments.filter(
    (apt) => apt.period === 'afternoon'
  );
  const eveningAppointments = transformedAppointments.filter(
    (apt) => apt.period === 'evening'
  );

  return [
    {
      title: 'Manhã',
      type: 'morning',
      timeRange: '09h-12h',
      appointments: morningAppointments,
    },
    {
      title: 'Tarde',
      type: 'afternoon',
      timeRange: '13h-18h',
      appointments: afternoonAppointments,
    },
    {
      title: 'Noite',
      type: 'evening',
      timeRange: '19h-21h',
      appointments: eveningAppointments,
    },
  ];
}

export function calculatePeriod(hour: number) {
  const isMorning = hour >= 9 && hour <= 12;
  const isAfternoon = hour >= 13 && hour <= 18;
  const isEvening = hour >= 19 && hour <= 21;

  return {
    isMorning,
    isAfternoon,
    isEvening,
  };
}

export function formatDateTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo',
  });
}

export function getHoursFromTimeString(timeStr: string): number {
  return parseInt(timeStr.split(':')[0]);
}
