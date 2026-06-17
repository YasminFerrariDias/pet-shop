import z from 'zod';

export const serviceSchema = z.object({
  serviceName: z.string(),
  duration: z.number(),
  price: z.number().min(0),
});

export const serviceFormSchema = z.object({
  serviceName: z.string().min(3, 'O nome do serviço é obrigatório'),
  duration: z
    .number()
    .min(1, 'A duração deve ser maior que 0')
    .max(480, 'A duração não pode exceder de 8 horas'),
  price: z.number().min(1, 'O preço do serviço é obrigatório'),
});
