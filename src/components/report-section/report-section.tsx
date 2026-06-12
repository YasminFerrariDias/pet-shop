import { ReportCard } from "../report-card";
import { ReportItem } from "@/types/report";

type ReportSectionProps = {
  report: ReportItem[];
  selectedDate: Date
  currentView: string
}

export const ReportSection = ({ selectedDate, currentView, report }: ReportSectionProps) => {
  const totalAmount = report.reduce((sum, item) =>
    sum + item.amount, 0
  )

  const totalRevenue = report.reduce((sum, item) =>
    sum + item.totalRevenue, 0
  )

  return (
    <section className="mb-8 bg-background-tertiary rounded-xl">
      <div className="flex items-center px-5 py-3 justify-between border-b border-[#2E2C30]">
        <div className="flex items-center gap-2">
          <h2 className="text-title-size text-content-primary">
            Sua Atividade
          </h2>
        </div>
        <span className="text-label-large-size text-content-secondary">
          TOTAL
        </span>
      </div>

      {report.length > 0 ? (
        <div>
          <div className="px-5">
            <div>
              {report.map((service, index) => (
                <ReportCard key={service.id} isFirstInSection={index === 0} reportItem={service} />
              ))}
            </div>
          </div>

          <div className="flex items-center w-full justify-between border-b border-[#2E2C30]" />

          <div className="px-5 grid justify-between grid-cols-[70%_30%] items-center py-3 md:grid-cols-[70%_30%]">
            <div className="text-left flex-1 mr-2">
              <h2 className="text-label-medium-size text-content-primary">
                LUCRO
              </h2>
            </div>

            <div className="flex justify-between">
              <span className="text-label-small-size text-content-primary font-semibold">
                {totalAmount}
              </span>

              <span className="text-paragraph-small-size text-content-secondary whitespace-nowrap">
                {totalRevenue.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </span>
            </div>
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