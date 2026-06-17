import { useEffect, useState } from 'react';
import { AppointFormValues, AppointmentFormProps } from '../types/appointment';
import { Service } from '@/features/services/types/service';
import { UseFormReturn } from 'react-hook-form';

export function useTotalDuration({
  allServices,
  form,
}: {
  allServices?: Service[];
  form: UseFormReturn<AppointFormValues>;
}) {
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const servicesIds = form.watch('servicesIds');

    const total = servicesIds.reduce((sum: number, id: string) => {
      const service = allServices?.find((s) => s.id === id);
      return sum + (service?.duration || 0);
    }, 0);

    setTotalDuration(total);
  }, [form, allServices]);

  return { totalDuration };
}
