import { ReportCard } from "../report-card";
import { ReportItem } from "@/types/report";

type ReportSectionProps = {
  report: ReportItem[];
}

export const ReportSection = ({ report }: ReportSectionProps) => {
  return (
    <section className="mb-8 bg-background-tertiary rounded-xl">
      <div className="flex items-center px-5 py-3 justify-between border-b border-[#2E2C30]">
        <div className="flex items-center gap-2">
          <h2 className="text-title-size text-content-primary">
            Sua Atividade
          </h2>
        </div>
        <span className="text-label-large-size text-content-secondary">
          {report.length}
        </span>
      </div>

      {report.length > 0 ? (
        <div className="px-5">
          <div>
            {report.map((service, index) => (
              <ReportCard key={service.id} isFirstInSection={index === 0} reportItem={service} />
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