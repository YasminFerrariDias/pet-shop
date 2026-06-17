import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AppointFormValues } from '../types/appointment.type';

export function useDateSync(form: UseFormReturn<AppointFormValues>) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    form.getValues('scheduleAt')
  );

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'scheduleAt' || name === undefined) {
        setSelectedDate(value.scheduleAt);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return {
    selectedDate,
  };
}
