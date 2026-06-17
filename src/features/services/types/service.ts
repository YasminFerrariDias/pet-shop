export type ServiceFormProps = {
  service?: Service;
  children?: React.ReactNode;
};

export type Service = {
  id: string;
  serviceName: string;
  duration: number;
  price: number;
};
