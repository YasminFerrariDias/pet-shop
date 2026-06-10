'use client'

import { addDays, format, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"

type CalendarHeaderProps = {
  selectedDate: Date
  onDateChange: (date: Date) => void
  onViewChange: (view: string) => void
  currentView: string
}

export const CalendarHeader = ({ selectedDate, onDateChange, onViewChange, currentView }: CalendarHeaderProps) => {
  return (
    <div className="custom-toolbar flex justify-between items-center p-4 mb-4 rounded-xl">
      <div className="flex flex-col gap-2">
        <div className="flex gap-1">
          <button type="button" onClick={() => onDateChange(subDays(selectedDate, 1))}>
            Anterior
          </button>
          <button type="button" onClick={() => onDateChange(new Date())}>
            Hoje
          </button>
          <button type="button" onClick={() => onDateChange(addDays(selectedDate, 1))}>
            Próximo
          </button>
        </div>

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
        </div>

      </div>
      <span className="custom-toolbar-label pr-1">
        {format(selectedDate, "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
      </span>
    </div>
  )
}
