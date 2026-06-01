import { Appointment } from "@/types/appointment"

type AppointmentCard = {
  appointment: Appointment
}

export const AppointmentCard = ({ appointment }: AppointmentCard) => {
  return (
    <div>
      <div className="text-left pr-4 md:pr-0">
        <span className="text-label-small-size text-content-primary font-semibold">
          {appointment.time}
        </span>
      </div>

      <div className="text-right md:text-left md:pr-4">
        <div className="flex items-center justify-end md:justify-start gap-1">
          <span className="text-label-small-size text-content-primary font-semibold">
            {appointment.petName}
          </span>
          <span className="text-paragraph-small-size text-content-primary ">
            /
          </span>
          <span className="text-paragraph-small-size text-content-primary ">
            {appointment.tutorName}
          </span>
        </div>

        <div className="text-left pr-4 md:mt-0 col-span-2 md:col-span-1 flex justify-end items-center gap-2">
          <span className="text-paragraph-small-size text-content-secondary">
            {appointment.description}
          </span>
        </div>
      </div>
    </div>
  )
}