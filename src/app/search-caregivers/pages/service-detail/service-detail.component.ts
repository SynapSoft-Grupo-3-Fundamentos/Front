import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

interface CaregiverDetail {
  id: number;
  completeName: string;
  age: number;
  address: string;
  caregiverExperience: number;
  completedServices: number;
  biography: string;
  profileImage: string;
  farePerHour: number;
  districtsScope: string;
  userId: number;
}

@Component({
  selector: 'app-search-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class SearchDetailComponent implements OnInit {
  caregiver: CaregiverDetail | null = null;
  loading = false;

  private readonly API = 'https://profilemicro-hjhzg0dqhhfrh7hg.canadacentral-01.azurewebsites.net/api/v1/caregiver';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    const userId = user?.id;

    if (!userId) {
      console.error('No hay userId disponible');
      return;
    }

    this.loading = true;

    this.http.get<CaregiverDetail[]>(this.API).subscribe({
      next: (caregivers) => {
        // Buscar por ID directamente
        this.caregiver = caregivers.find(c => c.id === userId) ?? null;
        console.log('Caregiver encontrado:', this.caregiver);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener caregiver:', err);
        this.loading = false;
      }
    });
  }}

