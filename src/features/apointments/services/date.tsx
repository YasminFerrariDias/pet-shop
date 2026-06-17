import { addMinutes } from "date-fns"

// Horário de atendimento
const OPENING_HOURS = {
  morning: { start: 9, end: 12 },
  afternoon: { start: 13, end: 18 },
  evening: { start: 19, end: 21 }
} as const

const PERIOD_LIMIT = {
  morning: 12 * 60,
  afternoon: 18 * 60,
  evening: 21 * 60,
}

// Período em minutos
export function isTimeInRange(hours: number, minutes: number): boolean {
  const totalMinutes = hours * 60 + minutes

  const periods = [
    { start: 9 * 60, end: 12 * 60 },
    { start: 13 * 60, end: 18 * 60 },
    { start: 19 * 60, end: 21 * 60 }
  ]

  return periods.some(period =>
    totalMinutes >= period.start && totalMinutes < period.end
  )
}

// Horário de encerramento
export function validateEndTime(scheduleAt: Date, duration: number) {
  const endTime = addMinutes(scheduleAt, duration);
  const hour = endTime.getHours();
  const minute = endTime.getMinutes();

  const startAppointment = scheduleAt.getHours();
  const totalEndMinutes = hour * 60 + minute;

  if (!isTimeInRange(hour, minute)) {
    return { valid: false, error: 'O término do agendamento está em um horário inválido!' }
  }

  if (startAppointment >= 9 && startAppointment < 12) {
    if (totalEndMinutes > PERIOD_LIMIT.morning) {
      return {
        valid: false,
        error:
          'O agendamento não pode ultrapassar o horário de almoço (12h às 13h)',
      };
    }
  } else if (startAppointment >= 13 && startAppointment < 18) {
    if (totalEndMinutes > PERIOD_LIMIT.afternoon) {
      return {
        valid: false,
        error:
          'O agendamento não pode ultrapassar o intervalo do jantar (18h às 19h)',
      };
    }
  } else if (startAppointment >= 19 && startAppointment < 21) {
    if (totalEndMinutes > PERIOD_LIMIT.evening) {
      return {
        valid: false,
        error:
          'O agendamento não pode ultrapassar o horário de fechamento (21h)',
      };
    }
  }

  return {
    valid: true
  }
}

// Validação do horário comercial 
export function validateBusinessHours(scheduleAt: Date) {
  const hour = scheduleAt.getHours();
  const minute = scheduleAt.getMinutes()

  if (scheduleAt <= new Date()) {
    return { valid: false, error: "O horário não pode estar no passado!" }
  }

  if (!isTimeInRange(hour, minute)) {
    return { valid: false, error: 'O horário de agendamento está fora do horário de atendimento!' }
  }

  return { valid: true }
}

