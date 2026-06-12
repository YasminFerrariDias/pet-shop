'use server'

import { AppointmentForm } from "@/components/appointment-form/appointment-form";
import { CalendarSection } from "@/components/calendar-section/calendar-section";
import { ReportSection } from "@/components/report-section";
import { ServiceForm } from "@/components/service-form/service-form";
import { ServiceSection } from "@/components/service-section";
import { Button } from "@/components/ui/button";
import { prisma } from '@/lib/prisma'
import { ReportItem } from "@/types/report";


export default async function Home({ }: { searchParams: Promise<{ date?: string }> }) {
  const appointments = await prisma.appointment.findMany({
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
    duration: service.duration,
    price: service.price,
  }))


  const servicesWithReport: ReportItem[] = formattedServices.map(service => {
    const amount = appointments.filter(apt =>
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

  return (
    <div className="bg-background-primary p-6" >
      <div className="flex items-center justify-between mb-8 gap-4 max-w-3xl mx-auto ml-auto">
        <div>
          <h1 className="text-title-size text-content-primary mb-2">
            Sua Agenda
          </h1>
          <p className="text-paragraph-medium-size text-content-secondary">
            Aqui você pode ver todos os clientes e serviços agendados para hoje
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5 md:max-w-5xl mx-auto">
        <div className="flex-1">
          <CalendarSection
            allAppointments={appointments}
            services={services}
          />
        </div>

        <div className="md:w-90 shrink-0 mb-20">
          <ServiceSection services={formattedServices} />
          <ReportSection report={servicesWithReport} />
        </div>
      </div>

      <div className="fixed gap-2 flex-row bottom-0 left-0 right-0 flex justify-center bg-[#232420] py-4.5 px-6 md:bottom-6 md:right-6 md:left-auto md:top-auto md:w-auto md:bg-transparent md:p-0">
        <ServiceForm>
          <Button variant="brand">
            Novo Serviço
          </Button>
        </ServiceForm>

        <AppointmentForm allServices={formattedServices}>
          <Button
            variant="brand"
            disabled={services.length === 0}
            title={services.length === 0
              ? "Cadastre um serviço primeiro" : ""
            }
            className={services.length === 0 ? `opacity-50 cursor-not-allowed` : ''}
          >
            Novo Agendamento
          </Button>
        </AppointmentForm>
      </div>
    </div>
  );
}
