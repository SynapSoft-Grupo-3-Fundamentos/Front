import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from 'src/app/shared/services/notification.service';

interface Reservation {
  id: number;
  caregiverId: number;
  tutorId: number;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
}

interface UserInfo {
  fullName: string;
  completeName: string;
}

@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './reservation-page.component.html',
  styleUrls: ['./reservation-page.component.css']
})
export class ReservationPageComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user') || '{}');
  role: 'tutor' | 'caregiver' = this.user?.role ?? 'tutor';
  reservations: (Reservation & { tutor?: UserInfo; caregiver?: UserInfo })[] = [];
  displayedColumns = ['id', 'caregiver', 'date', 'schedule', 'totalAmount', 'status', 'actions'];

  private readonly BASE_API = 'https://reservationsmicro-fdcge0gzhsekcgeg.canadacentral-01.azurewebsites.net/api/v1';
  private readonly USER_API = 'https://profilemicro-hjhzg0dqhhfrh7hg.canadacentral-01.azurewebsites.net/api/v1';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService // NUEVO
  ) {}

  ngOnInit(): void {
    const path = `${this.BASE_API}/reservations/${this.role}/${this.user.id}`;
    console.log("Usuario actual:", this.user);
    this.http.get<Reservation[]>(path).subscribe((res) => {
      this.reservations = res;
      this.attachUserData();
    });
  }

  attachUserData(): void {
    this.reservations.forEach((r, i) => {
      if (this.role === 'tutor') {
        this.http.get<UserInfo>(`${this.USER_API}/caregiver/${r.caregiverId}`).subscribe((user) => {
          this.reservations[i].caregiver = user;
        });
      } else {
        this.http.get<UserInfo>(`${this.USER_API}/tutors/${r.tutorId}`).subscribe((user) => {
          this.reservations[i].tutor = user;
        });
      }
    });
  }

  updateStatus(r: Reservation, status: string) {
    this.http
      .patch(`${this.BASE_API}/reservations/${r.id}/status/${status}`, {})
      .subscribe(() => {
        r.status = status;

        // Si el usuario es tutor, se envía notificación al cuidador
        if (this.role === 'tutor') {
          const title = `Estado de reserva actualizado`;
          const message = `El tutor ${this.user.fullName || this.user.completeName} ha marcado la reserva como "${status}".`;

          this.notificationService.sendNotification(
            r.caregiverId.toString(),
            title,
            message
          ).subscribe({
            next: () => console.log('✅ Notificación enviada al cuidador'),
            error: (err: any) => console.error('Error al enviar notificación', err)
          });
        }
      });
    if (this.role === 'tutor') {
      const isCancelled = status.toUpperCase() === 'CANCELLED';

      const title = isCancelled
        ? 'Reserva cancelada'
        : 'Estado de reserva actualizado';

      const message = isCancelled
        ? `El tutor ${this.user.fullName || this.user.completeName} ha cancelado una reserva.`
        : `El tutor ${this.user.fullName || this.user.completeName} ha marcado la reserva como "${status}".`;

      this.notificationService.sendNotification(
        r.caregiverId.toString(),
        title,
        message
      ).subscribe({
        next: () => console.log('✅ Notificación enviada al cuidador'),
        error: (err: any) => console.error('❌ Error al enviar notificación', err)
      });
    }


  }



}
