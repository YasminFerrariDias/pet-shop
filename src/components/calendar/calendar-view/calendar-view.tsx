'use client'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarCard } from '../calendar-card'
import { Appointment } from '@/features/apointments/types/appointment.type'
import { Service } from '@/features/services/types/service.type'

const locales = {
  'pt-BR': ptBR
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), {
    weekStartsOn: 1,
    locale: ptBR
  }),
  getDay,
  locales
})

export type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  serviceNames?: string[]
}

type CalendarViewProps = {
  events: CalendarEvent[]
  minHours?: number
  maxHours?: number
  view?: string
  selectedDate?: Date
  onViewChange?: (view: string) => void
  onDateChange?: (date: Date) => void
  originalAppointments?: Appointment[]
  allServices?: Service[]
  currentView?: string
}

export const CalendarView = ({ selectedDate = new Date(), currentView, originalAppointments, allServices, events, minHours, maxHours, view, onViewChange, onDateChange }: CalendarViewProps) => {
  const minDate = new Date(selectedDate)
  minDate.setHours(minHours ?? 0, 0, 0)

  const maxDate = new Date(selectedDate)
  maxDate.setHours(maxHours ?? 0, 0, 0)

  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const originalAppointment = originalAppointments?.find(
      apt => apt.id === event.id
    )

    return (
      <CalendarCard
        event={event}
        originalAppointment={originalAppointment}
        allServices={allServices}
        currentView={currentView}
      />
    )
  }

  return (
    <div className={view === 'day' ? 'h-auto' : 'h-150'}>
      <Calendar
        localizer={localizer}
        key={selectedDate.toISOString()}
        events={events}
        startAccessor='start'
        endAccessor='end'
        defaultView='day'
        step={30}
        culture='pt-BR'
        timeslots={1}
        min={minDate}
        max={maxDate}
        date={selectedDate}
        views={['day', 'week', 'month', 'agenda']}
        onView={(newView) => onViewChange?.(newView)}
        onNavigate={(newDate) => onDateChange?.(newDate)}
        messages={{
          today: 'Hoje',
          previous: 'Anterior',
          next: 'Próximo',
          day: 'Dia',
          week: 'Semana',
          month: 'Mês',
          agenda: 'Agenda',
          date: 'Date',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'Nenhum agendamento encontrado neste período!'
        }}
        formats={{
          timeGutterFormat: (date: Date) => format(date, 'HH:mm', { locale: ptBR }),
        }}
        view={view as any}
        components={{
          event: EventComponent,
        }}
        className='bg-background-tertiary rounded-xl p-4'
      />
    </div>
  )
}

