import { Reservation } from '../../reservations/model/reservation';
import { Card } from './card.entity';

export interface Payment {
  id?: number;
  userId: number;
  amount: number;
  reservation: Reservation;
  card: Card;
  createdAt: string;
}
