import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../model/reservation';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css',
})
export class ReservationListComponent implements OnInit {
  reservationList: any[] = [];
  displayedColumns = [
    'id',
    'caregiver',
    'date',
    'schedule',
    'totalAmount',
    'status',
    'actions',
  ];

  user = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    private reservationService: ReservationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.reservationService.getReservations().subscribe((reservations) => {
      console.log(reservations);

      this.reservationList = reservations;

      this.reservationList.forEach((r, i) => {
        if (this.user.role === 'tutor')
          this.userService.getCaregiverById(r.caregiverId).subscribe((user) => {
            this.reservationList[i].caregiver = user;
          });
        else
          this.userService.getTutorById(r.tutorId).subscribe((user) => {
            this.reservationList[i].tutor = user;
            console.log(this.reservationList);
          });
      });
    });
  }

  handleCancel(reservation: Reservation) {
    this.reservationService
      .patchReservationStatus(reservation.id, 'CANCELLED')
      .subscribe(() => {
        this.reservationList = this.reservationList.map((r) => {
          if (r.id === reservation.id) {
            return { ...r, status: 'CANCELLED' };
          }
          return r;
        });
      });
  }

  handleAccept(reservation: Reservation) {
    this.reservationService
      .patchReservationStatus(reservation.id, 'ACCEPTED')
      .subscribe(() => {
        this.reservationList = this.reservationList.map((r) => {
          if (r.id === reservation.id) {
            return { ...r, status: 'ACCEPTED' };
          }
          return r;
        });
      });
  }

  handleStartService(reservation: Reservation) {
    this.reservationService
      .patchReservationStatus(reservation.id, 'IN_PROGRESS')
      .subscribe(() => {
        this.reservationList = this.reservationList.map((r) => {
          if (r.id === reservation.id) {
            return { ...r, status: 'IN_PROGRESS ' };
          }
          return r;
        });
      });
  }

  handleFinishService(reservation: Reservation) {
    this.reservationService
      .patchReservationStatus(reservation.id, 'COMPLETED')
      .subscribe(() => {
        this.reservationList = this.reservationList.map((r) => {
          if (r.id === reservation.id) {
            return { ...r, status: 'COMPLETED' };
          }
          return r;
        });
      });
  }
}
