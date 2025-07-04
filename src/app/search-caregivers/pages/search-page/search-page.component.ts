import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

interface Caregiver {
  id: number;
  completeName: string;
  biography: string;
  profileImage: string;
  districtsScope: string;
}

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterModule],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  caregivers: Caregiver[] = [];
  loading = false;
  selectedDistrict = '';
  orderBy = '';

  private readonly API = 'https://profilemicro-hjhzg0dqhhfrh7hg.canadacentral-01.azurewebsites.net/api/v1/caregiver/search';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCaregivers();
  }

  loadCaregivers(): void {
    this.loading = true;
    const params = `?district=${this.selectedDistrict}&sort=${this.orderBy}`;
    this.http.get<Caregiver[]>(`${this.API}${params}`).subscribe({
      next: res => { this.caregivers = res; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
