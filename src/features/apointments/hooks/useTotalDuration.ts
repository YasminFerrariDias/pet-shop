// useTotalDuration.ts
import { useEffect, useState } from 'react';
import { AppointFormValues } from '../types/appointment';
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
    const subscription = form.watch((value) => {
      const servicesIds = value.servicesIds;

      if (!servicesIds || servicesIds.length === 0) {
        setTotalDuration(0);
        return;
      }

      const total = servicesIds.reduce((sum: number, id: string) => {
        const service = allServices?.find((s) => s.id === id);
        return sum + (service?.duration || 0);
      }, 0);

      setTotalDuration(total);
    });

    return () => subscription.unsubscribe();
  }, [allServices]);

  return { totalDuration };
}
