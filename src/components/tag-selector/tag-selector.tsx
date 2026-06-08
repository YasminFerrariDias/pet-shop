import { Service } from "@/types/service";
import { Tag } from "../tag/tag"

type TagSelectorProps = {
  allServices?: Service[];
  selectIds?: string[];
  onChange?: (ids: string[]) => void;
}

export const TagSelector = ({ allServices, selectIds = [], onChange }: TagSelectorProps) => {
  const handleToggle = (serviceId: string) => {
    const isSelected = selectIds.includes(serviceId);
    const newSelectedIds = isSelected
      ? selectIds.filter(id => id !== serviceId)
      : [...selectIds, serviceId];

    onChange?.(newSelectedIds)
  }

  return (
    <div className='relative flex gap-3'>
      {allServices?.map((service) => (
        <Tag
          key={service.id}
          isSelect={selectIds.includes(service.id)}
          onClick={() => handleToggle(service.id)}
        >
          {service.serviceName}
        </Tag>
      ))}
    </div>
  )
}