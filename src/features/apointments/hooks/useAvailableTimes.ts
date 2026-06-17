import { format } from 'date-fns';
import { validateEndTime } from '../services/appointment-date';
import { Appointment } from '../types/appointment';
import { useEffect, useState } from 'react';
import { TIME_OPTION } from '@/utils/time-option';

export function useAvailableTimes({
  selectedDate,
  totalDuration,
  dayAppointments,
}: {
  selectedDate?: Date;
  totalDuration: number;
  dayAppointments: Appointment[];
}) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }

    const now = new Date();
    const isToday =
      format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

    const times = TIME_OPTION.filter((time: string) => {
      if (isToday) {
        const [hour, minute] = time.split(':').map(Number);
        const optionDate = new Date(selectedDate);
        optionDate.setHours(hour, minute, 0, 0);
        if (optionDate < now) {
          return false;
        }
      }

      const isOccupied = dayAppointments.some((apt) => {
        const isSameDay =
          format(apt.scheduleAt, 'yyyy-MM-dd') ===
          format(selectedDate, 'yyyy-MM-dd');
        const isSameTime = format(apt.scheduleAt, 'HH:mm') === time;
        return isSameDay && isSameTime;
      });

      if (isOccupied) {
        return false;
      }

      if (totalDuration > 0) {
        const [hour, minute] = time.split(':').map(Number);
        const scheduleAt = new Date(selectedDate);
        scheduleAt.setHours(hour, minute, 0, 0);
        const result = validateEndTime(scheduleAt, totalDuration);
        if (!result.valid) {
          return false;
        }
      }

      return true;
    });

    setAvailableTimes(times);
  }, [selectedDate, totalDuration, dayAppointments]);

  return {
    availableTimes,
    hasAvailableTimes: availableTimes.length > 0,
  };
}
