import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private baseUrl = 'https://notificationmicro-dpbegpbcdpe7a5c3.canadacentral-01.azurewebsites.net/api/v1/notifications';

  constructor(private http: HttpClient) {}

  sendNotification(userId: string, title: string, message: string) {
    const body = { userId, title, message };
    return this.http.post(`${this.baseUrl}/send`, body);
  }
}
