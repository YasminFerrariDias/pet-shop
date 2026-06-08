'use server'

import { AppointmentForm } from "@/components/appointment-form/appointment-form";
import { DatePicker } from "@/components/date-picker";
import { PeriodSection } from "@/components/period-section";
import { ServiceForm } from "@/components/service-form/service-form";
import { ServiceSection } from "@/components/service-section";
import { Button } from "@/components/ui/button";
import { prisma } from '@/lib/prisma'
import { groupAppointmentByPeriod } from "@/utils";
import { endOfDay, isValid, parseISO, startOfDay } from "date-fns";

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  const parsedDate = date ? parseISO(date) : new Date()
  const selectedDate = isValid(parsedDate) ? parsedDate : new Date()

  const appointments = await prisma.appointment.findMany({
    where: {
      scheduleAt: {
        gte: startOfDay(selectedDate),
        lte: endOfDay(selectedDate)
      }
    },
    orderBy: {
      scheduleAt: 'asc'
    }
  });

  const services = await prisma.service.findMany({
    orderBy: {
      serviceName: 'asc'
    }
  })

  const formattedServices = services.map(service => ({
    ...service,
    duration: service.duration.toString(),
    price: service.price.toString(),
  }))

  const periods = groupAppointmentByPeriod(appointments)

  return (
    <div className="bg-background-primary p-6">
      <div className="flex items-center justify-between mb-8 gap-4 max-w-3xl mx-auto">
        <div>
          <h1 className="text-title-size text-content-primary mb-2">
            Sua Agenda
          </h1>
          <p className="text-paragraph-medium-size text-content-secondary">
            Aqui você pode ver todos os clientes e serviços agendados para hoje
          </p>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <DatePicker />
        </div>
      </div>

      <div className="mt-3 mb-8 md:hidden">
        <DatePicker />
      </div>

      <div className="flex flex-col md:flex-row gap-5 md:max-w-5xl mx-auto">
        <div className="flex-1">
          {periods.map((period) => (
            <PeriodSection period={period} key={period.type} />
          ))}
        </div>

        <div className="md:w-90 shrink-0">
          <ServiceSection services={formattedServices} />
        </div>
      </div>

      <div className="fixed gap-2 flex-row bottom-0 left-0 right-0 flex justify-center bg-[#232420] py-4.5 px-6 md:bottom-6 md:right-6 md:left-auto md:top-auto md:w-auto md:bg-transparent md:p-0">
        <ServiceForm>
          <Button variant="brand">
            Novo Serviço
          </Button>
        </ServiceForm>

        <AppointmentForm>
          <Button variant="brand">
            Novo Agendamento
          </Button>
        </AppointmentForm>
      </div>
    </div>
  );
}
