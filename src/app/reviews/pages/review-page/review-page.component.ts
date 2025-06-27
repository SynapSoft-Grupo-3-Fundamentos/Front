import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Review {
  id: number;
  formUrl: string;
  userId: number;
}

@Component({
  selector: 'app-review-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.css']
})
export class ReviewPageComponent {
  reviews: Review[] = [];
  showReviews = false;
  loading = false;
  posting = false;
  developerMode = false;
  newReview = {
    formUrl: '',
    userId: 0
  };

  private readonly API_BASE = 'https://reviewmicro-breghjaeffcubvbd.canadacentral-01.azurewebsites.net/api/v1';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === '|') {
      this.developerMode = !this.developerMode;
    }
  }

  loadReviews(): void {
    this.showReviews = false;
    this.loading = true;
    this.http.get<Review[]>(`${this.API_BASE}/review`).subscribe({
      next: res => {
        this.reviews = res;
        this.showReviews = true;
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar reviews', err);
        this.loading = false;
      }
    });
  }

  submitReview(): void {
    if (!this.newReview.formUrl || !this.newReview.userId) return;
    this.posting = true;
    this.http.post(`${this.API_BASE}/review`, this.newReview).subscribe({
      next: () => {
        this.snackBar.open('Review enviada correctamente', 'Cerrar', { duration: 3000 });
        this.newReview = { formUrl: '', userId: 0 };
        this.posting = false;
        if (this.showReviews) this.loadReviews();
      },
      error: err => {
        console.error('Error al enviar review', err);
        this.posting = false;
      }
    });
  }

  protected readonly location = location;
}
