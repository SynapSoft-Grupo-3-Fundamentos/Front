import { Component } from '@angular/core';
import { MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-reservation-notification',
  standalone: true,
  imports: [MatIcon],
  template: `
    <section class="reservation-notification">
      <mat-icon class="notification-icon">check_circle</mat-icon>
      <article>
        <h3 class="notification-title">Reservation requested</h3>
        <p>
          Your reservation has been requested.
          <br>
          Check your reservation list in the menu.
        </p>
      </article>
    </section>
  `,
  styleUrls: ['./reservation-notification.component.css']
})
export class ReservationNotificationComponent {

}
