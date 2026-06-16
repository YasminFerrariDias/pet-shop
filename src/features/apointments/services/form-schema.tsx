import { setHours, setMinutes } from "date-fns"
import z from "zod"

export const AppointmentFormSchema = z.object({
  tutorName: z.string().min(3, "O nome do tutor é obrigatório"),
  petName: z.string().min(3, "O nome do pet é obrigatório"),
  phone: z.string().min(11, "O telefone é obrigatório"),
  servicesIds: z.array(z.string()).min(1, "Selecione pelo menos um serviço"),
  scheduleAt: z.date({
    error: 'A data é obrigatória'
  }).min(1, 'Selecione uma data primeiro'),
  time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Formato inválido. Use HH:mm (ex: 14:30)"
  })
}).refine((data) => {
  const [hour, minute] = data.time.split(':')
  const hourNum = Number(hour)

  const isValidHour =
    (hourNum >= 9 && hourNum < 12) ||
    (hourNum >= 13 && hourNum < 18) ||
    (hourNum >= 19 && hourNum < 21)

  if (!isValidHour) return false

  const scheduleDateTime = setMinutes(
    setHours(data.scheduleAt, hourNum),
    Number(minute)
  )

  return scheduleDateTime > new Date()
}, {
  path: ['time'],
  error: 'Horário inválido. Por favor, selecione um horário futuro dentro do expediente de funcionamento'
})
