'use client'

import { useState } from 'react'
import { CalendarHeader } from '@/components/calendar-header/calendar-header'
import { CalendarView } from '@/components/calendar-view'
import { addMinutes, endOfDay, startOfDay } from 'date-fns'
import { Appointment } from '@/types/appointment'
import { Service } from '@/types/service'

type CalendarSectionProps = {
  allAppointments: Appointment[]
  services: Service[]
}

export const CalendarSection = ({
  allAppointments,
  services
}: CalendarSectionProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentView, setCurrentView] = useState('day')

  const parsedAppointments = allAppointments.map((apt) => ({
    ...apt,
    scheduleAt: new Date(apt.scheduleAt),
  }))

  const appointmentsOfDay = parsedAppointments.filter(apt => {
    const aptDate = apt.scheduleAt
    const start = startOfDay(selectedDate)
    const end = endOfDay(selectedDate)
    return aptDate >= start && aptDate <= end
  })


  const allEvents = parsedAppointments.map(apt => {
    const totalDuration = apt.servicesIds.reduce((total, id) => {
      const service = services.find(s => s.id === id)

      return total + (service?.duration || 0)
    }, 0)

    return {
      id: apt.id,
      title: `${apt.petName} - ${apt.tutorName}`,
      start: apt.scheduleAt,
      end: addMinutes(apt.scheduleAt, Math.max(totalDuration, 30)),
    }
  })

  const dayEvents = appointmentsOfDay.map(apt => {
    const totalDuration = apt.servicesIds.reduce((total, id) => {
      const service = services.find(s => s.id === id)

      return total + (service?.duration || 0)
    }, 0)

    return {
      id: apt.id,
      title: `${apt.petName} - ${apt.tutorName}`,
      start: apt.scheduleAt,
      end: addMinutes(apt.scheduleAt, totalDuration),
    }
  })

  const morningEventsFiltered = dayEvents.filter(e => {
    const hour = e.start.getHours()
    return hour >= 9 && hour < 12
  })

  const afternoonEventsFiltered = dayEvents.filter(e => {
    const hour = e.start.getHours()
    return hour >= 13 && hour < 18
  })

  const eveningEventsFiltered = dayEvents.filter(e => {
    const hour = e.start.getHours()
    return hour >= 19 && hour < 21
  })

  return (
    currentView === 'day' ? (
      <div className='flex flex-col gap-2 h-fit'>
        <CalendarHeader selectedDate={selectedDate} onDateChange={setSelectedDate}
          onViewChange={setCurrentView} currentView={currentView} />
        <CalendarView events={morningEventsFiltered} minHours={9} maxHours={12} view={currentView} selectedDate={selectedDate} />
        <CalendarView events={afternoonEventsFiltered} minHours={13} maxHours={18} view={currentView} selectedDate={selectedDate} />
        <CalendarView events={eveningEventsFiltered} minHours={19} maxHours={21} view={currentView} selectedDate={selectedDate} />
      </div>
    ) : (
      <div>
        <CalendarHeader selectedDate={selectedDate} onDateChange={setSelectedDate}
          onViewChange={setCurrentView} currentView={currentView} />
        <CalendarView
          events={allEvents}
          view={currentView}
          selectedDate={selectedDate}
          onViewChange={setCurrentView}
          onDateChange={setSelectedDate}
        />
      </div>
    )
  )
}