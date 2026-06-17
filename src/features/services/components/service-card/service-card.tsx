'use client'

import { cn } from "@/lib/utils"
import { ServiceForm } from "../service-form/service-form"
import { Button } from "../../../../components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../../../components/ui/alert-dialog"
import { Pen as EditIcon, Trash2 as DeleteIcon, Loader2 as LoadingIcon } from "lucide-react"
import { Service } from "@/features/services/types/service"
import { formatDuration } from "@/utils/formatDuration-utils"
import { useServiceActions } from "../hooks/useServiceActions"

type ServiceCardProps = {
  service: Service
  isFirstInSection?: boolean
}

export const ServiceCard = ({ service, isFirstInSection = false }: ServiceCardProps) => {
  const { handleDelete, isDeleting } = useServiceActions()

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-[35%_55%_10%] items-center py-3",
        !isFirstInSection && "border-t border-border-divisor"
      )}
    >

      <div className="text-left flex-1 min-w-0 mr-2">
        <span className="text-label-small-size text-content-primary font-semibold block truncate">
          {service?.serviceName}
        </span>
      </div>

      <div className="flex justify-end md:justify-start gap-2 min-w-0">
        <span className="text-label-small-size text-content-primary font-semibold whitespace-nowrap">
          {formatDuration(service?.duration)}
        </span>

        <span className="text-paragraph-small-size text-content-secondary whitespace-nowrap truncate min-w-0">
          {service.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}
        </span>
      </div>

      <div className="col-span-2 md:col-span-1 flex justify-end items-center gap-2 mt-2 md:mt-0">
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

                <AlertDialogAction onClick={() => handleDelete(service.id)} disabled={isDeleting}>
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