import { CalendarEvent } from "../calendar-view"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Trash2 as DeleteIcon, Loader2 as LoadingIcon } from "lucide-react"
import { Button } from "../ui/button"
import { deleteAppointment } from "@/app/actions-appointment"
import { useState } from "react"
import { toast } from "sonner"

type CalendarCardProps = {
  event: CalendarEvent
}

export const CalendarCard = ({ event }: CalendarCardProps) => {
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
    <div className="bg-brand text-white rounded text-xs flex justify-between">
      <div>
        <p className="font-semibold truncate">{event.title}</p>

        {event.serviceNames && event.serviceNames.length > 0 && (
          <p className="text-xs opacity-75 truncate">
            {event.serviceNames.join(', ')}
          </p>
        )}
      </div>

      <div className="flex gap-3 -mt-4">
        <button>oio</button>
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
    </div>
  )
}