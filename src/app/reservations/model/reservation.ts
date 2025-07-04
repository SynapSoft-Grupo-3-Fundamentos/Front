export interface Reservation {
  id?: number;
  caregiverId: number;
  tutorId: number;
  date: string;
  startTime: string;
  endTime: string;
  paymentMethodId?: number;
  status: string;
  totalAmount: number
}

