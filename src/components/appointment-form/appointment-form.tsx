'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import z from 'zod'

import { Form, useForm } from 'react-hook-form'

const appointmentFormSchema = z.object({
  tutorName: z.string().min(3, "O nome do tutor é obrigatório"),
  petName: z.string().min(3, "O nome do pet é obrigatório"),
  phone: z.string().min(11, "O telefone é obrigatório"),
  description: z.string().min(3, "A descrição é obrigatória"),
})

type AppointFormValues = z.infer<typeof appointmentFormSchema>;

export const AppointmentForm = () => {
  const form = useForm<AppointFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      tutorName: '',
      petName: '',
      phone: '',
      description: ''
    }
  })

  const onSubmit = (data: AppointFormValues) => {
    console.log(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="brand">Novo Agendamento</Button>
      </DialogTrigger>

      <DialogContent variant="appointment" overlayVariant="blurred" showCloseButton>
        <DialogHeader>
          <DialogTitle size="modal">
            Agende um atendimento
          </DialogTitle>
          <DialogDescription size="modal">
            Preencha os dados do cliente para realizar o agendamento:
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <input {...form.register('tutorName')} type="text" />

            <button type="submit">salvar</button>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}