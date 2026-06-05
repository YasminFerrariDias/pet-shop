import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { Popover, PopoverTrigger } from "../ui/popover"

export const DatePicker = () => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-min[180px] justify-between text-left font-normal bg-transparent border-border-primary text-content-primary hover:bg-background-tertiary hover:border-border-secondary hover:text-content-primary focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-border-brand focus:border-border-brand focus-visible:border-border-brand"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-content-brand" />
              <span>Selecione uma data</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
      </Popover>
      <Button variant="outline">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}