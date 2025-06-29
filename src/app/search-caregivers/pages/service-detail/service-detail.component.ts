import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.css']
})
export class SearchDetailComponent implements OnInit {
  caregiver: CaregiverDetail | null = null;
  loading = false;

  private readonly API = 'https://profilemicro-hjhzg0dqhhfrh7hg.canadacentral-01.azurewebsites.net/api/v1/caregiver';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.loadDetail();
  }

  loadDetail(): void {
    const id = this.route.snapshot.params['id'];
    this.loading = true;
    this.http.get<CaregiverDetail>(`${this.API}/${id}`).subscribe({
      next: res => { this.caregiver = res; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
