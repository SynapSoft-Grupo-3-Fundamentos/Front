import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Reservation } from '../model/reservation';
import { User } from '../../auth/model/User';
import { catchError, Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService extends BaseService<Reservation> {
  user: User | null = null;
  role: string = '';

  constructor() {
    super();
    this.basePath = `${this.basePath}/reservations`;

    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.role = this.user?.role ?? '';
  }

  getReservations() {
    return this.http
      .get<Reservation[]>(
        `${this.basePath}/${
          this.role === 'tutor' ? 'tutor' : 'caregiver'
        }/${this.user?.id}`
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  patchReservationStatus(reservationId?: number, status?: string): Observable<Reservation> {
    return this.http
      .patch<Reservation>(
        `${this.basePath}/${reservationId}/status/${status}`,
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }
}
