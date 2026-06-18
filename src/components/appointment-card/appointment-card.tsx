'use client'

import { cn } from "@/lib/utils"
import { Appointment } from "@/types/appointment"
import { AppointmentForm } from "../appointment-form/appointment-form"
import { Button } from "../ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Pen as EditIcon, Trash2 as DeleteIcon, Loader2 as LoadingIcon } from "lucide-react"
import { useState } from "react"
import { deleteAppointment } from "@/app/actions-appointment"
import { toast } from "sonner"
import { Service } from "@/types/service"
import { format, addMinutes } from "date-fns"

type AppointmentCard = {
  appointment: Appointment
  isFirstInSection?: boolean
  allServices: Service[]
}

export const AppointmentCard = ({ appointment, isFirstInSection = false, allServices }: AppointmentCard) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    const result = await deleteAppointment(appointment.id)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    toast.success('Agendamento removido com sucesso!')
    setIsDeleting(false)
  }

  const totalDuration = appointment.servicesIds.reduce((total, id) => {
    const service = allServices.find(s => s.id === id)

    return total + (service?.duration || 0);
  }, 0)

  const startTime = appointment.scheduleAt
  const endTime = addMinutes(startTime, totalDuration)

  return (
    <div
      className={cn("grid grid-cols-2 md:grid-cols-[15%_35%_30%_20%] items-center py-3", !isFirstInSection && "border-t border-border-divisor")}
    >
      <div className="text-left pr-4 md:pr-0">
        <span className="text-label-small-size text-content-primary font-semibold">
          {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
        </span>
      </div>

      <div className="text-right md:text-left md:pr-4">
        <div className="flex items-center justify-end md:justify-start gap-1">
          <span className="text-label-small-size text-content-primary font-semibold">
            {appointment.petName}
          </span>
          <span className="text-paragraph-small-size text-content-secondary">
            /
          </span>
          <span className="text-paragraph-small-size text-content-secondary">
            {appointment.tutorName}
          </span>
        </div>

      </div>
      <div className="text-left pr-4 hidden md:block mt-1 md:mt-0 col-span-2 md:col-span-1">
        <span className="text-paragraph-small-size text-content-secondary">
          {appointment.servicesIds.map(id => {
            const service = allServices.find(s => s.id === id);

            return service?.serviceName
          }).join(', ')}
        </span>
      </div>

      <div className="text-right mt-2 md:mt-0 col-span-2 md:col-span-1 flex justify-end items-center gap-2">
        <AppointmentForm appointment={appointment} allServices={allServices}>
          <Button variant="edit" size="icon">
            <EditIcon size={16} />
          </Button>
        </AppointmentForm>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="remove" size="icon">
              <DeleteIcon size={16} />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Remover agendamento
              </AlertDialogTitle>

              <AlertDialogDescription>
                Tem certeza que deseja remover esse agendamento? Essa ação não pode ser desfeita.
              </AlertDialogDescription>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancelar
                </AlertDialogCancel>

                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting && (
                    <LoadingIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirmar remoção
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div >
  )
}