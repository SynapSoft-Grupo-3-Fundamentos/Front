import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Card } from '../model/card.entity';
import { catchError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodsService extends BaseService<Card> {
  constructor() {
    super();
    this.basePath = `${this.basePath}/cards`;
  }

  getByUserId(id: string) {
    return this.http
      .get<Card[]>(
        `${this.basePath}/${id}`
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  updateCard(id?: number, item?: any) {
    return this.http
      .put<Card[]>(
        `${this.basePath}/${id}`,
        item
      )
      .pipe(retry(2), catchError(this.handleError));
  }
}
