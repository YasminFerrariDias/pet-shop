'use client'

import { cn } from "@/lib/utils"
import { Service } from "@/types/service"
import { ServiceForm } from "../service-form/service-form"
import { Button } from "../ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Pen as EditIcon, Trash2 as DeleteIcon, Loader2 as LoadingIcon } from "lucide-react"
import { useState } from "react"
import { deleteService } from "@/app/actions-service"
import { toast } from "sonner"

type ServiceCard = {
  service: Service
  isFirstInSection?: boolean
}

export const ServiceCard = ({ service, isFirstInSection = false }: ServiceCard) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    const result = await deleteService(service.id)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    toast.success('Agendamento removido com sucesso!')
    setIsDeleting(false)
  }

  return (
    <div
      className={cn("grid grid-cols-2 md:grid-cols-[15%_35%_30%_20%] items-center py-3", !isFirstInSection && "border-t border-border-divisor")}
    >
      <div className="text-left pr-4 md:pr-0">
        <span className="text-label-small-size text-content-primary font-semibold">
          {service?.serviceName}
        </span>
      </div>

      <span className="text-label-small-size text-content-primary font-semibold">
        {service?.duration}
      </span>

      <span className="text-paragraph-small-size text-content-secondary ">
        {service?.price}
      </span>

      <div className="text-right mt-2 md:mt-0 col-span-2 md:col-span-1 flex justify-end items-center gap-2">
        <ServiceForm service={service}>
          <Button variant="edit" size="icon">
            <EditIcon size={16} />
          </Button>
        </ServiceForm>

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
                Tem certeza que deseja remover esse serviço? Essa ação não pode ser desfeita.
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