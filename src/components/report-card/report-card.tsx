'use client'

import { cn } from "@/lib/utils"
import { ReportItem } from "@/types/report"

type ServiceCard = {
  reportItem: ReportItem
  isFirstInSection?: boolean
}

export const ReportCard = ({ reportItem, isFirstInSection = false }: ServiceCard) => {
  return (
    <div
      className={cn
        (`grid justify-between grid-cols-[70%_30%] items-center py-3 md:grid-cols-[70%_30%]`,
          !isFirstInSection && "border-t border-border-divisor",
          reportItem.amount === 0 && 'hidden'
        )}
    >
      <div className="text-left flex-1 mr-2">
        <span className="text-label-small-size text-content-primary font-semibold block truncate">
          {reportItem?.serviceName}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-label-small-size text-content-primary font-semibold">
          {reportItem?.amount}
        </span>

        <span className="text-paragraph-small-size text-content-secondary whitespace-nowrap">
          {reportItem.totalRevenue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}
        </span>
      </div>
    </div>
  )
}