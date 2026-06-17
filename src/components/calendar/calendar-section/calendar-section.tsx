'use client'

import { useState } from 'react'
import { CalendarHeader } from '@/components/calendar/calendar-header/calendar-header'
import { CalendarView } from '@/components/calendar/calendar-view'
import { addMinutes, endOfDay, endOfMonth, endOfWeek, endOfYear, startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns'
import { Appointment } from '@/features/apointments/types/appointment.type'
import { Service } from '@/features/services/types/service.type'
import { ReportItem } from '@/features/reports/types/report'
import { ServiceSection } from '../../../features/services/components/service-section'

type CalendarSectionProps = {
  allAppointments: Appointment[]
  services: Service[]
}

export const CalendarSection = ({
  allAppointments,
  services,
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

  const appointmentsOfWeek = parsedAppointments.filter(apt => {
    const aptWeek = apt.scheduleAt
    const start = startOfWeek(selectedDate)
    const end = endOfWeek(selectedDate)
    return aptWeek >= start && aptWeek <= end
  })

  const appointmentsOfMonth = parsedAppointments.filter(apt => {
    const aptMonth = apt.scheduleAt
    const start = startOfMonth(selectedDate)
    const end = endOfMonth(selectedDate)
    return aptMonth >= start && aptMonth <= end
  })

  const appointmentsOfAgenda = parsedAppointments.filter(apt => {
    const aptAgenda = apt.scheduleAt
    const start = startOfYear(selectedDate)
    const end = endOfYear(selectedDate)
    return aptAgenda >= start && aptAgenda <= end
  })

  const allEvents = parsedAppointments.map(apt => {
    let totalDuration = 0
    const serviceNames: string[] = []

    apt.servicesIds.forEach(id => {
      const service = services.find(s => s.id === id)
      if (service) {
        totalDuration += service.duration || 0
        serviceNames.push(service.serviceName)
      }
    })

    return {
      id: apt.id,
      title: `${apt.petName} - ${apt.tutorName}`,
      start: apt.scheduleAt,
      end: addMinutes(apt.scheduleAt, Math.max(totalDuration, 30)),
      serviceNames: serviceNames
    }
  })

  const dayEvents = appointmentsOfDay.map(apt => {
    let totalDuration = 0
    const serviceNames: string[] = []

    apt.servicesIds.forEach(id => {
      const service = services.find(s => s.id === id)
      if (service) {
        totalDuration += service.duration || 0
        serviceNames.push(service.serviceName)
      }
    })

    return {
      id: apt.id,
      title: `${apt.petName} - ${apt.tutorName}`,
      start: apt.scheduleAt,
      end: addMinutes(apt.scheduleAt, totalDuration),
      serviceNames: serviceNames
    }
  })

  const formattedServices = services.map(service => ({
    ...service,
    duration: service.duration,
    price: service.price,
  }))

  function visualizationBasedReport() {
    let servicesWithReport: ReportItem[] = []

    if (currentView === 'day') {
      servicesWithReport = services.map(service => {
        const amount = appointmentsOfDay.filter(apt =>
          apt.servicesIds?.includes(service.id)
        ).length

        return {
          id: service.id,
          serviceName: service.serviceName,
          price: service.price,
          duration: service.duration,
          amount: amount,
          totalRevenue: service.price * amount
        }
      })
    } else if (currentView === 'week') {
      servicesWithReport = services.map(service => {
        const amount = appointmentsOfWeek.filter(apt =>
          apt.servicesIds?.includes(service.id)
        ).length

        return {
          id: service.id,
          serviceName: service.serviceName,
          price: service.price,
          duration: service.duration,
          amount: amount,
          totalRevenue: service.price * amount
        }
      })
    } else if (currentView === 'month') {
      servicesWithReport = services.map(service => {
        const amount = appointmentsOfMonth.filter(apt =>
          apt.servicesIds?.includes(service.id)
        ).length

        return {
          id: service.id,
          serviceName: service.serviceName,
          price: service.price,
          duration: service.duration,
          amount: amount,
          totalRevenue: service.price * amount
        }
      })
    } else if (currentView === 'agenda') {
      servicesWithReport = services.map(service => {
        const amount = appointmentsOfAgenda.filter(apt =>
          apt.servicesIds?.includes(service.id)
        ).length

        return {
          id: service.id,
          serviceName: service.serviceName,
          price: service.price,
          duration: service.duration,
          amount: amount,
          totalRevenue: service.price * amount
        }
      })
    }

    return servicesWithReport
  }

  const reportData = visualizationBasedReport()

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
      <div>
        <div className='flex flex-col gap-2 h-fit *:'>
          <CalendarHeader
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onViewChange={setCurrentView}
            currentView={currentView}
            reportData={reportData}
          />
          <h1 className='text-center p-2 pt-5'>AGENDA DIÁRIA</h1>
          <CalendarView
            events={morningEventsFiltered}
            minHours={9}
            maxHours={12}
            view={currentView}
            selectedDate={selectedDate}
            originalAppointments={parsedAppointments}
            allServices={services}
          />
          <CalendarView
            events={afternoonEventsFiltered}
            minHours={13}
            maxHours={18}
            view={currentView}
            selectedDate={selectedDate}
            originalAppointments={parsedAppointments}
            allServices={services}
          />
          <CalendarView
            events={eveningEventsFiltered}
            minHours={19}
            maxHours={21}
            view={currentView}
            selectedDate={selectedDate}
            originalAppointments={parsedAppointments}
            allServices={services}
          />

          <div>
            <ServiceSection services={formattedServices} />
          </div>
        </div>
      </div>
    ) : (
      <div>
        <CalendarHeader
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onViewChange={setCurrentView}
          currentView={currentView}
          reportData={reportData}
        />

        <h1 className='text-center p-2 pt-5'>
          AGENDA
          {currentView === 'week' ? ' SEMANAL' : currentView === 'month' ? ' MENSAL' : ' ANUAL'}
        </h1>

        <CalendarView
          currentView={currentView}
          events={allEvents}
          view={currentView}
          selectedDate={selectedDate}
          onViewChange={setCurrentView}
          onDateChange={setSelectedDate}
          originalAppointments={parsedAppointments}
          allServices={services}
        />
        <div className='mt-2 mb-5'>
          <ServiceSection services={formattedServices} />
        </div>
      </div>
    )
  )
}