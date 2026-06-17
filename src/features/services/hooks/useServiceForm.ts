import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { serviceFormSchema } from '../services/form-schema';
import { createService, updateService } from '../services/actions-service';
import { toast } from 'sonner';
import z from 'zod';
import { ServiceFormProps } from '../types/service';

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export function useServiceForm({ service }: ServiceFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      serviceName: '',
      duration: undefined,
      price: undefined,
    },
  });

  const onSubmit = async (data: ServiceFormValues) => {
    const isEdit = !!service?.id;

    const result = isEdit
      ? await updateService(service.id, { ...data })
      : await createService({ ...data });

    if ('error' in result) {
      toast.error(result.error);
      return;
    }

    toast.success(`Cadastro ${isEdit ? 'atualizado' : 'criado'} com sucesso!`);

    setIsOpen(false);
    form.reset();
  };

  useEffect(() => {
    if (service) {
      form.reset({
        serviceName: service.serviceName,
        duration: service.duration,
        price: service.price,
      });
    } else {
      form.reset({
        serviceName: '',
        duration: undefined,
        price: undefined,
      });
    }
  }, [service, form]);

  return { form, isOpen, setIsOpen, onSubmit };
}
