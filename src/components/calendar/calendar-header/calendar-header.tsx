'use client'

import { addDays, addMonths, addYears, endOfWeek, format, startOfWeek, startOfYear, subDays, subMonths, subYears } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ReportSection } from "../../../features/reports/report-section"
import { ReportItem } from "@/features/reports/types/report"

type CalendarHeaderProps = {
  selectedDate: Date
  onDateChange: (date: Date) => void
  onViewChange: (view: string) => void
  currentView: string
  reportData: ReportItem[]
}

export const CalendarHeader = ({ reportData, selectedDate, onDateChange, onViewChange, currentView }: CalendarHeaderProps) => {
  const handlePrevious = () => {
    if (currentView === 'day') {
      onDateChange(subDays(selectedDate, 1))
    } else if (currentView === 'week') {
      onDateChange(subDays(selectedDate, 7))
    } else if (currentView === 'month') {
      onDateChange(subMonths(selectedDate, 1))
    } else if (currentView === 'agenda') {
      onDateChange(subYears(selectedDate, 1))
    }
  }

  const handleNext = () => {
    if (currentView === 'day') {
      onDateChange(addDays(selectedDate, 1))
    } else if (currentView === 'week') {
      onDateChange(addDays(selectedDate, 7))
    } else if (currentView === 'month') {
      onDateChange(addMonths(selectedDate, 1))
    }
    else if (currentView === 'agenda') {
      onDateChange(addYears(selectedDate, 1))
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-2 justify-between">
      <div className="custom-toolbar flex text-center flex-col items-center p-4 rounded-xl gap-2 justify-center w-full ">
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

        <span className="custom-toolbar-label p-2">
          {currentView === 'day' ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : ''}

          {currentView === 'week' ? (
            `${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}  -  ${format(endOfWeek(selectedDate, { weekStartsOn: 1 }), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`) : ''}

          {currentView === 'month' ? format(selectedDate, "MMMM", { locale: ptBR }) : ''}

          {currentView === 'agenda' ? format(selectedDate, "yyyy", { locale: ptBR }) : ''}
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
      <ReportSection
        report={reportData}
        selectedDate={selectedDate}
        currentView={currentView}
      />
    </div>
  )
}
