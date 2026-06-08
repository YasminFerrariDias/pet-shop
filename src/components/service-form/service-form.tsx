'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form'
import { DollarSign, Loader2, Timer, User } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { IMask, IMaskInput } from "react-imask";
import { toast } from "sonner";
//import { createService, updateService } from "@/app/actions";
import { useEffect, useState } from "react";
//import { Service } from "@/types/service";

const serviceFormSchema = z.object({
  serviceName: z.string().min(3, "O nome do serviço é obrigatório"),
  duration: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Formato inválido. Use HH:mm (ex: 14:30)"
  }),
  price: z.string().min(1, "O preço do serviço é obrigatório"),
  observation: z.string().min(0, "A descrição é opcional"),
})

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

type ServiceFormProps = {
  service?: Service;
  children?: React.ReactNode;
}

export const ServiceForm = ({ service, children }: ServiceFormProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      serviceName: '',
      duration: '',
      price: '',
      observation: '',
    }
  })

  const onSubmit = async (data: ServiceFormValues) => {
    const isEdit = !!service?.id;

    const result = isEdit
      ? await updateService(service.id, {
        ...data,
      })
      : await createService({
        ...data,
      })

    if ('error' in result) {
      toast.error(result.error)
      return
    }

    toast.success(`Cadastro ${isEdit ? "atualizado" : "criado"} com sucesso!`)

    setIsOpen(false)
    form.reset()
  }

  useEffect(() => {
    form.reset(service);
  }, [service, form])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && (
        <DialogTrigger>
          {children}
        </DialogTrigger>
      )}

      <DialogContent variant="appointment" overlayVariant="blurred" showCloseButton>
        <DialogHeader>
          <DialogTitle size="modal">
            Cadastre um serviço
          </DialogTitle>
          <DialogDescription size="modal">
            Preencha os dados do seu serviço para facilitar o agendamento:
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="serviceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Nome do Serviço
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand" size={20} />
                      <Input
                        placeholder="Nome do serviço"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              <FormField control={form.control} name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Duração
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Timer
                          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand"
                          size={20}
                        />
                        <IMaskInput
                          placeholder="00:00"
                          mask="HH:MM"
                          className="pl-10 flex h-12 w-full rounded-md border border-border-primary bg-background-tertiary px-3 py-2 text-sm text-content-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-content-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-border-brand disabled:cursor-not-allowed disabled:opacity-50 hover:border-border-secondary focus:border-border-brand focus-visible:border-border-brand aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
                          blocks={{
                            HH: {
                              mask: IMask.MaskedRange,
                              from: 0,
                              to: 23,
                            },
                            MM: {
                              mask: IMask.MaskedRange,
                              from: 0,
                              to: 59,
                            }
                          }}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Preço
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign
                          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand"
                          size={20}
                        />
                        <IMaskInput
                          placeholder="R$ 000,00"
                          mask="R$ 000,00"
                          className="pl-10 flex h-12 w-full rounded-md border border-border-primary bg-background-tertiary px-3 py-2 text-sm text-content-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-content-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-border-brand disabled:cursor-not-allowed disabled:opacity-50 hover:border-border-secondary focus:border-border-brand focus-visible:border-border-brand aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField control={form.control} name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Observação (opcional)
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>

                      <Textarea
                        placeholder="Observação"
                        className="resize-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" variant='brand' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cadastrar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}
