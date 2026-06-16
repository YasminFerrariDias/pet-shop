export type AppointmentPeriodDay = 'morning' | 'afternoon' | 'evening';

export type Appointment = {
  id: string;
  petName: string;
  tutorName: string;
  phone: string;
  servicesIds: string[];
  scheduleAt: Date;
  period?: AppointmentPeriodDay;
};

export type AppointmentPeriod = {
  title: string;
  type: AppointmentPeriodDay;
  timeRange: string;
  appointments: Appointment[];
};
