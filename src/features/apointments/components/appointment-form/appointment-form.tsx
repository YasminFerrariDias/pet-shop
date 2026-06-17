'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarIcon, ChevronDownIcon, Clock, Dog, Loader2, Phone, User } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { IMaskInput } from "react-imask";
import { startOfToday, format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../../../../components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { TagSelector } from "../tag-selector";
import { validateEndTime } from '@/features/apointments/services/date';
import { useAppointmentForm } from "../../hooks/useAppointmentForm";
import { AppointmentFormProps } from "../../types/appointment-props";
import { useAvailableTimes } from "../../hooks/useAvailableTimes";
import { useEffect, useState } from "react";
import { getAppointmentByDate } from "../../services/appointment-schema.server";

export const AppointmentForm = ({ appointment, children, allServices }: AppointmentFormProps) => {
  const {
    form,
    isOpen,
    setIsOpen,
    onSubmit,
    totalDuration,
    dayAppointments,
    setDayAppointments,
    errorMessage,
    setErrorMessage,
  } = useAppointmentForm({ appointment, allServices })

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(form.getValues('scheduleAt'))

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'scheduleAt' || name === undefined) {
        setSelectedDate(value.scheduleAt)
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  const { availableTimes, hasAvailableTimes } = useAvailableTimes({
    selectedDate,
    totalDuration,
    dayAppointments,
  })


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
                            if (date) {
                              form.setValue('scheduleAt', date, {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true,
                              })

                              const appointments = await getAppointmentByDate(date)
                              setDayAppointments(appointments)
                            } else {
                              form.setValue('scheduleAt', undefined as any)
                              setDayAppointments([])
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

                          const [hour, minute] = selectedTime.split(':').map(Number);

                          const scheduleAt = new Date(selectedDate);
                          scheduleAt.setHours(hour, minute, 0, 0);

                          const result = validateEndTime(scheduleAt, totalDuration);
                          if (!result.valid) {
                            setErrorMessage(result.error || 'Horário inválido');
                          } else {
                            setErrorMessage('');
                          }
                        }}
                      >
                        <SelectTrigger
                          className="flex items-center gap-2"
                          title={!form.watch('scheduleAt') ? "Primeiro selecione uma data!" : ''}
                        >
                          <Clock className="h-4 w-4 text-content-brand" />
                          <SelectValue placeholder="--:-- --" />
                          {field.value && !availableTimes.includes(field.value)
                            ? `${field.value} (indisponivel)`
                            : field.value}
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimes.length === 0 ? (
                            <div className="p-2 text-center text-sm">
                              Nenhum horário disponível
                            </div>
                          ) : (
                            availableTimes.map((time: string) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))
                          )}
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