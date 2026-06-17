import { UseFormReturn } from 'react-hook-form';
import { validateEndTime } from '../services/date';
import { AppointFormValues } from '../types/appointment';

export function useTimeSelection(
  form: UseFormReturn<AppointFormValues>,
  totalDuration: number,
  setErrorMessage: (message: string) => void
) {
  const handleTimeChange = (selectedTime: string) => {
    const selectedDate = form.getValues('scheduleAt');

    if (!selectedDate) {
      setErrorMessage('Selecione uma data primeiro');
      return;
    }

    const [hour, minute] = selectedTime.split(':').map(Number);

    const scheduleAt = new Date(selectedDate);
    scheduleAt.setHours(hour, minute, 0, 0);

    const result = validateEndTime(scheduleAt, totalDuration);
    if (!result.valid) {
      setErrorMessage(result.error || 'Horário inválido');
    } else {
      setErrorMessage('');
    }
  };

  return { handleTimeChange };
}
