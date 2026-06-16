'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form'
import { CalendarIcon, ChevronDownIcon, Clock, Dog, Loader2, Phone, User } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { IMaskInput } from "react-imask";
import { startOfToday, format, setMinutes, setHours, addMinutes } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../../../../components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { toast } from "sonner";
import { createAppointment, getAppointmentByDate, updateAppointment } from "@/app/actions-appointment";
import { useEffect, useState } from "react";
import { Appointment } from "@/features/apointments/types/appointment";
import { TagSelector } from "../tag-selector";
import { Service } from "@/features/services/types/service";

const appointmentFormSchema = z.object({
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

type AppointFormValues = z.infer<typeof appointmentFormSchema>;

type AppointmentFormProps = {
  appointment?: Appointment;
  children?: React.ReactNode;
  allServices?: Service[];
}

export const AppointmentForm = ({ appointment, children, allServices }: AppointmentFormProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [totalDuration, setTotalDuration] = useState(0)
  const [dayAppointments, setDayAppointments] = useState<Appointment[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm<AppointFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      tutorName: '',
      petName: '',
      phone: '',
      servicesIds: [],
      scheduleAt: undefined,
      time: ''
    }
  })

  const onSubmit = async (data: AppointFormValues) => {
    const [hour, minute] = data.time.split(':')

    const scheduleAt = setMinutes( // etapa 2 - ajusta o minuto
      setHours(data.scheduleAt, Number(hour)), // etapa 1 - ajusta a hora
      Number(minute)
    )

    const isEdit = !!appointment?.id;

    const result = isEdit
      ? await updateAppointment(appointment.id, {
        ...data,
        scheduleAt,
      })
      : await createAppointment({
        ...data,
        scheduleAt
      })

    if ('error' in result) {
      toast.error(result.error)
      return
    }

    toast.success(`Agendamento ${isEdit ? "atualizado" : "criado"} com sucesso!`)

    setIsOpen(false)
    form.reset()
  }

  const validateTimetable = (startTime: string, duration: number, selectedDate: Date): string | null => {
    if (!selectedDate) {
      return 'Selecione uma data primeiro'
    }

    const [hour, minute] = startTime.split(':').map(Number)

    const referenceDate = new Date(selectedDate)
    referenceDate.setHours(hour, minute, 0, 0)

    const endTime = addMinutes(referenceDate, duration)

    const endHour = endTime.getHours()

    const isStartValid =
      (hour >= 9 && hour < 12) ||
      (hour >= 13 && hour < 18) ||
      (hour >= 19 && hour < 21)

    if (!isStartValid) {
      return 'Horário de início inválido'
    }

    const isEndValid =
      (endHour >= 9 && endHour < 12) ||
      (endHour >= 13 && endHour < 18) ||
      (endHour >= 19 && endHour < 21)

    if (!isEndValid) {
      return 'Horário de fim inválido'
    }

    const occupiedSlots = dayAppointments
      .filter(apt => apt && apt.scheduleAt)
      .map(apt => {
        const totalDuration = (apt.servicesIds || []).reduce((sum, id) => {
          const service = allServices?.find(s => s.id === id)
          return sum + (service?.duration || 0)
        }, 0)

        const endTime = addMinutes(apt.scheduleAt, totalDuration)

        return {
          start: apt.scheduleAt,
          end: endTime
        }
      })

    const newStart = referenceDate
    const newEnd = endTime

    const hasConflict = occupiedSlots.some(slot => {
      return newStart < slot.end && newEnd > slot.start
    })

    if (hasConflict) {
      return 'Já existe um agendamento neste horário'
    }

    return null
  }

  useEffect(() => {
    const servicesIds = form.watch('servicesIds')

    const total = servicesIds.reduce((sum, id) => {
      const service = allServices?.find(s => s.id === id)
      return sum + (service?.duration || 0)
    }, 0)

    setTotalDuration(total)
  }, [form.watch('servicesIds'), allServices])

  useEffect(() => {
    if (appointment) {
      form.reset({
        tutorName: appointment.tutorName,
        petName: appointment.petName,
        phone: appointment.phone,
        servicesIds: appointment.servicesIds || [],
        scheduleAt: appointment.scheduleAt,
        time: format(appointment.scheduleAt, "HH:mm"),
      })
    } else {
      form.reset({
        tutorName: '',
        petName: '',
        phone: '',
        servicesIds: [],
        scheduleAt: undefined,
        time: '',
      })
    }
  }, [appointment, form])

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
            Agende um atendimento
          </DialogTitle>
          <DialogDescription size="modal">
            Preencha os dados do cliente para realizar o agendamento:
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="tutorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Nome do Tutor
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand" size={20} />
                      <Input
                        placeholder="Nome do tutor"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField control={form.control} name="petName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Nome do Pet
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Dog className="absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand" size={20} />
                      <Input
                        placeholder="Nome do pet"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField control={form.control} name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Telefone
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand"
                        size={20}
                      />
                      <IMaskInput
                        placeholder="(99) 99999-9999"
                        mask="(00) 00000-0000"
                        className="pl-10 flex h-12 w-full rounded-md border border-border-primary bg-background-tertiary px-3 py-2 text-sm text-content-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-content-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-border-brand disabled:cursor-not-allowed disabled:opacity-50 hover:border-border-secondary focus:border-border-brand focus-visible:border-border-brand aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField control={form.control} name="servicesIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Serviços
                  </FormLabel>
                  <FormControl>
                    <TagSelector
                      allServices={allServices}
                      selectedIds={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              <FormField control={form.control} name="scheduleAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Data
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline"
                            className={cn(
                              'w-full justify-between text-left font-normal bg-background-tertiary border-border-primary text-content-primary hover:bg-background-tertiary hover:border-border-secondary hover:text-content-primary focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-border-brand focus:border-border-brand focus-visible:border-border-brand',
                              !field.value && 'text-content-secondary'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="text-content-brand" size={20} />
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                            </div>
                            <ChevronDownIcon className="opacity-50 h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={async (date) => {
                            field.onChange(date)
                            if (date) {
                              const appointments = await getAppointmentByDate(date)
                              setDayAppointments(appointments)
                            }
                          }}
                          disabled={(date) => date < startOfToday()}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Hora
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        disabled={!form.watch('scheduleAt')}
                        onValueChange={(selectedTime) => {
                          field.onChange(selectedTime)

                          const selectedDate = form.getValues('scheduleAt')

                          if (!selectedDate) {
                            setErrorMessage('Selecione uma data primeiro')
                            return
                          }

                          const erro = validateTimetable(selectedTime, totalDuration, selectedDate)

                          if (erro) {
                            setErrorMessage(erro)
                          } else {
                            setErrorMessage('')
                          }
                        }}
                      >
                        <SelectTrigger
                          className="flex items-center gap-2"
                          title={!form.watch('scheduleAt') ? "Primeiro selecione uma data!" : ''}
                        >
                          <Clock className="h-4 w-4 text-content-brand" />
                          <SelectValue placeholder="--:-- --" />
                        </SelectTrigger>
                        <SelectContent>
                          {(() => {
                            const availableTimes = TIME_OPTION.filter((time) => {
                              const selectedDate = form.getValues('scheduleAt')
                              const now = new Date()
                              const isToday = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')

                              let isPastTime = false
                              if (isToday && selectedDate) {
                                const [hour, minute] = time.split(':').map(Number)
                                const optionDate = new Date(selectedDate)
                                optionDate.setHours(hour, minute, 0, 0)
                                isPastTime = optionDate < now
                              }
                              if (isPastTime) return false

                              const isOccupied = dayAppointments.some((apt) => format(apt.scheduleAt, 'HH:mm') === time)
                              if (isOccupied) return false

                              let hasConflict = false
                              if (selectedDate && totalDuration > 0 && !isOccupied) {
                                hasConflict = validateTimetable(time, totalDuration, selectedDate) !== null
                              }
                              if (hasConflict) return false

                              let isOverLimit = false
                              if (selectedDate && totalDuration > 0) {
                                const [hour, minute] = time.split(':').map(Number)
                                const startTime = new Date(selectedDate)
                                startTime.setHours(hour, minute, 0, 0)
                                const endTime = addMinutes(startTime, totalDuration)
                                const endHour = endTime.getHours()
                                const endMinute = endTime.getMinutes()
                                const totalEndMinutes = endHour * 60 + endMinute

                                if (hour >= 9 && hour < 12) isOverLimit = totalEndMinutes > 12 * 60
                                else if (hour >= 13 && hour < 18) isOverLimit = totalEndMinutes > 18 * 60
                                else if (hour >= 19 && hour < 21) isOverLimit = totalEndMinutes > 21 * 60
                              }

                              return !isOverLimit
                            })

                            if (availableTimes.length === 0) {
                              return (
                                <div className="p-2 text-center text-sm">
                                  Nenhum horário disponível
                                </div>
                              )
                            } else {
                              return TIME_OPTION.map((time) => {
                                const selectedDate = form.getValues('scheduleAt')

                                const now = new Date()

                                const isToday = selectedDate &&
                                  format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')

                                let isPastTime = false
                                if (isToday && selectedDate) {
                                  const [hour, minute] = time.split(':').map(Number)
                                  const optionDate = new Date(selectedDate)
                                  optionDate.setHours(hour, minute, 0, 0)
                                  isPastTime = optionDate < now
                                }

                                if (isPastTime) return null

                                const isOccupied = dayAppointments.some((apt) => {
                                  return format(apt.scheduleAt, 'HH:mm') === time
                                })

                                let hasConflict = false

                                if (selectedDate && totalDuration > 0 && !isOccupied) {
                                  hasConflict = validateTimetable(time, totalDuration, selectedDate) !== null
                                }

                                let isOverLimit = false

                                if (selectedDate && totalDuration > 0) {
                                  const [hour, minute] = time.split(':').map(Number)
                                  const startTime = new Date(selectedDate)
                                  startTime.setHours(hour, minute, 0, 0)
                                  const endTime = addMinutes(startTime, totalDuration)
                                  const endHour = endTime.getHours()
                                  const endMinute = endTime.getMinutes()
                                  const totalEndMinutes = endHour * 60 + endMinute

                                  if (hour >= 9 && hour < 12) {
                                    isOverLimit = totalEndMinutes > 12 * 60
                                  } else if (hour >= 13 && hour < 18) {
                                    isOverLimit = totalEndMinutes > 18 * 60
                                  } else if (hour >= 19 && hour < 21) {
                                    isOverLimit = totalEndMinutes > 21 * 60
                                  }
                                }

                                return (
                                  <SelectItem
                                    key={time}
                                    value={time}
                                    disabled={isOccupied || hasConflict || isOverLimit}
                                    className={isOccupied || hasConflict || isOverLimit ? 'hidden' : ''}
                                  >
                                    {time} {(isOccupied || hasConflict || isOverLimit) && "(indisponível)"}
                                  </SelectItem>
                                )
                              })
                            }
                          })()}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {errorMessage && (
                      <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              {totalDuration > 0 && (
                <p className="text-sm text-content-secondary">
                  Duração total: {Math.floor(totalDuration / 60)}h {totalDuration % 60}min
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant='brand' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Agendar
              </Button>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}

const generateTimeOptions = (): string[] => {
  const times = []

  for (let hour = 9; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 21 && minute > 0) break;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      times.push(timeString)
    }
  }

  return times;
}

const TIME_OPTION = generateTimeOptions().filter((time) => {
  const hour = parseInt(time.split(':')[0])
  return (hour >= 9 && hour < 12) || (hour >= 13 && hour < 18) || (hour >= 19 && hour < 21)
})
