import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Payment } from '../model/payment.entity';
import { catchError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends BaseService<Payment> {
  constructor() {
    super();
    this.basePath = `${this.basePath}/payments`;
  }

  getByUserId(id: number) {
    return this.http
      .get<Payment[]>(
        `${this.basePath}/${id}`
      )
      .pipe(retry(2), catchError(this.handleError));
  }
}
