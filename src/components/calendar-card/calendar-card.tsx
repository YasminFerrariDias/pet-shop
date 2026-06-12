import { CalendarEvent } from "../calendar-view"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Trash2 as DeleteIcon, EditIcon, Loader2 as LoadingIcon } from "lucide-react"
import { Button } from "../ui/button"
import { deleteAppointment } from "@/app/actions-appointment"
import { useState } from "react"
import { toast } from "sonner"
import { AppointmentForm } from "../appointment-form/appointment-form"
import { Appointment } from "@/types/appointment"
import { Service } from "@/types/service"

type CalendarCardProps = {
  event: CalendarEvent
  originalAppointment?: Appointment
  allServices?: Service[]
  currentView?: string
}

export const CalendarCard = ({ currentView, event, originalAppointment, allServices }: CalendarCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    const result = await deleteAppointment(event.id)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    toast.success('Agendamento removido com sucesso!')
    setIsDeleting(false)
  }

  if (!event) return null

  return (
    <div className="bg-brand text-white rounded text-xs flex">
      <div>
        <p className="font-semibold truncate">{event.title}</p>

        {event.serviceNames && event.serviceNames.length > 0 && (
          <p className="text-xs opacity-75 truncate">
            {event.serviceNames.join(', ')}
          </p>
        )}
      </div>

      <div className={`flex gap-1.5 ml-auto 
      ${currentView === "agenda" ? '' : 'hidden'}`}>
        <AppointmentForm appointment={originalAppointment} allServices={allServices}>
          <Button variant="edit" size="icon" className="h-8 w-8">
            <EditIcon size={16} />
          </Button>
        </AppointmentForm>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="remove" size="icon" className="h-8 w-8">
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
    </div>
  )
}