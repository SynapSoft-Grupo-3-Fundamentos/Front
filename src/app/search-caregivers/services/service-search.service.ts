import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Schedule, ServiceSearch } from '../model/service-search';
import { catchError, map, Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceSearchService extends BaseService<ServiceSearch> {
  constructor() {
    super();

    this.basePath = `${this.basePath}/caregiver`;
  }

  override getAll() {
    return this.http
      .get<ServiceSearch[]>(`${this.basePath}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  override getById(id: number) {
    return this.http
      .get<ServiceSearch>(`${this.basePath}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getCaregiverScheduleById(id: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.basePath}-schedule/${id}`).pipe(
      retry(2),
      catchError(this.handleError),
      map((service) => service)
    );
  }

  getByCaregiverId(id: number) {
    return this.http.get<ServiceSearch>(`${this.basePath}/${id}`).pipe(
      retry(2),
      catchError(this.handleError),
      map((services) => services)
    );
  }

  search(disctrict: string, sort: string) {
    return this.http.get<ServiceSearch[]>(`${this.basePath}/search?district=${disctrict}&sort=${sort}`).pipe(
      retry(2),
      catchError(this.handleError),
      map((services) => services)
    );
  }

  patchBiography(item: any): Observable<any> {
    return this.http
      .patch<any>(
        `${this.basePath}/biography`,
        JSON.stringify(item),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  patchPlaceFare(item: any): Observable<any> {
    return this.http
      .patch<any>(
        `${this.basePath}/place-fare`,
        JSON.stringify(item),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  updateCaregiverSchedule(
    caregiverScheduleId: number | undefined,
    item: any
  ): Observable<Schedule> {

    const request = {
      caregiverScheduleId: caregiverScheduleId,
      ...item,
    };

    return this.http
      .put<any>(
        `${this.basePath}-schedule`,
        JSON.stringify(request),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  addCaregiverSchedule(
    caregiverId: number | undefined,
    item: Schedule | undefined
  ): Observable<Schedule> {
    const request = {
      caregiverId: caregiverId,
      weekDay: item?.weekDay,
      startHour: item?.startHour,
      endHour: item?.endHour,
    };

    return this.http
      .post<any>(
        `${this.basePath}-schedule`,
        JSON.stringify(request),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteCaregiverSchedule(
    caregiverScheduleId: number | undefined,
  ): Observable<Schedule> {

    return this.http
      .delete<any>(
        `${this.basePath}-schedule/${caregiverScheduleId}`,
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }
}
