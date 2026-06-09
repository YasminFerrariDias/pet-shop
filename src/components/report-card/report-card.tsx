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
      className={cn("grid grid-cols-4 md:grid-cols-[42%_10%_48%_5%] items-center py-3", !isFirstInSection && "border-t border-border-divisor")}
    >
      <div className="text-left flex-1 mr-2">
        <span className="text-label-small-size text-content-primary font-semibold block truncate">
          {reportItem?.serviceName}
        </span>
      </div>

      <div className="flex gap-2">
        <span className="text-label-small-size text-content-primary font-semibold">
          {reportItem.amount}
        </span>

        <span className="text-paragraph-small-size text-content-secondary whitespace-nowrap">
          {reportItem?.totalRevenue}
        </span>
      </div>
    </div>
  )
}