import { useState } from 'react';
import { deleteService } from '../services/service-mutations';
import { toast } from 'sonner';

export function useServiceActions() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);

    try {
      const result = await deleteService(id);

      if (result?.error) {
        toast.error(result.error);
        setIsDeleting(false);
        return;
      }

      toast.success('Serviço removido com sucesso!');
      setIsDeleting(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, handleDelete };
}
