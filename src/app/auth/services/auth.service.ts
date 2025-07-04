import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { catchError, map, retry } from 'rxjs';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService<User> {
  constructor() {
    super();
    this.basePath = `${this.basePath}`;
  }

  loginAsTutor(email: string, password: string) {
    return this.http
      .get<User[]>(`${this.basePath}/tutors`, {
        params: { email, password },
      })
      .pipe(
        retry(2),
        catchError(this.handleError),
        map((res) => res[0])
      );
  }

  loginAsCaregiver(email: string, password: string) {
    return this.http
      .get<User[]>(`${this.basePath}/caregivers`, {
        params: { email, password },
      })
      .pipe(
        retry(2),
        catchError(this.handleError),
        map((res) => res[0])
      );
  }

  signUp(user: Omit<User, 'id'>) {
    return this.http
      .post<User>(this.basePath, user)
      .pipe(retry(2), catchError(this.handleError));
  }
}
