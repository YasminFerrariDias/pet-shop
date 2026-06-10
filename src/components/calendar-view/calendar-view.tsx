'use client'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const locales = {
  'pt-BR': ptBR
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), {
    weekStartsOn: 0
  }),
  getDay,
  locales
})

type Event = {
  id: string
  title: string
  start: Date
  end: Date
}

type CalendarViewProps = {
  events: Event[]
}

export const CalendarView = ({ events }: CalendarViewProps) => {
  return (
    <div className='h-150'>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        defaultView='day'
        views={['day', 'week', 'month', 'agenda']}
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
          event: 'Evento'
        }}
        formats={{
          timeGutterFormat: (date: Date) => format(date, 'HH:mm', { locale: ptBR }),
          eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
            return `${format(start, 'HH:mm', { locale: ptBR })} - ${format(end, 'HH:mm', { locale: ptBR })}`
          },
        }}
        className='bg-background-tertiary rounded-xl p-4'
      />
    </div>
  )
}