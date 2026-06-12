'use client'

import { addDays, addMonths, endOfWeek, format, startOfWeek, subDays, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

type CalendarHeaderProps = {
  selectedDate: Date
  onDateChange: (date: Date) => void
  onViewChange: (view: string) => void
  currentView: string
}

export const CalendarHeader = ({ selectedDate, onDateChange, onViewChange, currentView }: CalendarHeaderProps) => {
  const handlePrevious = () => {
    if (currentView === 'day') {
      onDateChange(subDays(selectedDate, 1))
    } else if (currentView === 'week') {
      onDateChange(subDays(selectedDate, 7))
    } else if (currentView === 'month') {
      onDateChange(subMonths(selectedDate, 1))
    } else if (currentView === 'agenda') {
      onDateChange(subDays(selectedDate, 1))
    }
  }

  const handleNext = () => {
    if (currentView === 'day') {
      onDateChange(addDays(selectedDate, 1))
    } else if (currentView === 'week') {
      onDateChange(addDays(selectedDate, 7))
    } else if (currentView === 'month') {
      onDateChange(addMonths(selectedDate, 1))
    } else if (currentView === 'agenda') {
      onDateChange(addDays(selectedDate, 1))
    }
  }

  return (
    <div className="custom-toolbar flex text-center flex-col items-center p-4 mb-4 rounded-xl gap-2">
      <div className="flex flex-col gap-3 justify-center text-center items-center">
        <div className="flex gap-1">
          <button type="button" onClick={handlePrevious}>
            Anterior
          </button>
          <button type="button" onClick={() => onDateChange(new Date())}>
            Hoje
          </button>
          <button type="button" onClick={handleNext}>
            Próximo
          </button>
        </div>

        <span className="custom-toolbar-label pr-1">
          {currentView === 'day' || 'agenda' ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : ''}

          {currentView === 'week' ? (
            `${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}  -  ${format(endOfWeek(selectedDate, { weekStartsOn: 1 }), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`) : ''}

          {currentView === 'month' ? format(selectedDate, "MMMM", { locale: ptBR }) : ''}
        </span>

        <div className="flex gap-1">
          <button
            className={currentView === 'day' ? 'active' : ''}
            onClick={() => onViewChange('day')}
          >
            Dia
          </button>
          <button
            className={currentView === 'week' ? 'active' : ''}
            onClick={() => onViewChange('week')}
          >
            Semana
          </button>
          <button
            className={currentView === 'month' ? 'active' : ''}
            onClick={() => onViewChange('month')}
          >
            Mês
          </button>
          <button
            className={currentView === 'agenda' ? 'active' : ''}
            onClick={() => onViewChange('agenda')}
          >
            Agenda
          </button>
        </div>
      </div>
    </div>
  )
}
