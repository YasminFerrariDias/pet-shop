import { Service } from "@/features/services/types/service";
import { Tag } from "../tag/tag"

type TagSelectorProps = {
  allServices?: Service[];
  selectedIds?: string[];
  onChange?: (ids: string[]) => void;
}

export const TagSelector = ({ allServices = [], selectedIds = [], onChange }: TagSelectorProps) => {
  // Se allServices estiver vazio, não renderiza
  if (!allServices || allServices.length === 0) {
    return <div className="text-gray-400">Carregando serviços...</div>;
  }

  return (
    <div className='relative flex gap-3 flex-wrap'>
      {allServices.map((service) => (
        <Tag
          key={service.id}
          isSelect={selectedIds.includes(service.id)}
          onClick={() => {
            const isSelected = selectedIds.includes(service.id);
            const newSelectedIds = isSelected
              ? selectedIds.filter(id => id !== service.id)
              : [...selectedIds, service.id];
            onChange?.(newSelectedIds);
          }}
        >
          {service.serviceName}
        </Tag>
      ))}
    </div>
  );
}