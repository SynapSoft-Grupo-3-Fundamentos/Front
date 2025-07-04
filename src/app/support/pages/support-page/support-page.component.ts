import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface Ticket {
  id: number;
  name: string;
  mail: string;
  description: string;
  ticketStatus: 'IN_PROGRESS' | 'RESOLVED' | 'OPEN';
}

@Component({
  selector: 'app-support-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './support-page.component.html',
  styleUrls: ['./support-page.component.css']
})
export class SupportPageComponent {
  tickets: Ticket[] = [];
  formModel = { name: '', mail: '', description: '' };
  loadingTickets = false;
  postingTicket = false;
  showTickets = false;

  private readonly API_BASE = 'https://supportmicro-h8ekbwcfh6h0ftbn.canadacentral-01.azurewebsites.net/api/v1';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  onLoadTickets(): void {
    this.showTickets = false;
    this.loadingTickets = true;
    this.http.get<Ticket[]>(`${this.API_BASE}/tickets`).subscribe({
      next: data => {
        this.tickets = data;
        this.showTickets = true;
        this.loadingTickets = false;
      },
      error: err => {
        console.error('Error cargando tickets', err);
        this.loadingTickets = false;
      }
    });
  }

  onSubmit(): void {
    this.postingTicket = true;
    const payload = { ...this.formModel };
    this.http.post<Ticket>(`${this.API_BASE}/tickets`, payload).subscribe({
      next: () => {
        this.postingTicket = false;
        this.snackBar.open('Ticket enviado con éxito', 'Cerrar', { duration: 3000 });
        this.formModel = { name: '', mail: '', description: '' };
        if (this.showTickets) {
          this.onLoadTickets();
        }
      },
      error: err => {
        console.error('Error creando ticket', err);
        this.postingTicket = false;
      }
    });
  }
}
