import { Service } from "@/features/services/types/service";
import { ServiceCard } from "../service-card";

type ServiceSectionProps = {
  services: Service[];
}

export const ServiceSection = ({ services }: ServiceSectionProps) => {
  return (
    <section className="mb-8 bg-background-tertiary rounded-xl">
      <div className="flex items-center px-5 py-3 justify-between border-b border-[#2E2C30]">
        <div className="flex items-center gap-2">
          <h2 className="text-title-size text-content-primary">
            Seus Serviços
          </h2>
        </div>
        <span className="text-label-large-size text-content-secondary">
          {services.length}
        </span>
      </div>

      {services.length > 0 ? (
        <div className="px-5">
          <div>
            {services.map((service, index) => (
              <ServiceCard key={service.id} isFirstInSection={index === 0} service={service} />
            ))}

          </div>
        </div>
      ) : (
        <p className="text-paragraph-small-size text-content-secondary p-5">
          Nenhum serviço foi cadastrado!
        </p>
      )}
    </section >
  )
}