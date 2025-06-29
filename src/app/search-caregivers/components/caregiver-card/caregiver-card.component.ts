import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {ServiceSearch} from "../../model/service-search";

export interface Card {
  id: number;
  number: string;
  holder: string;
  year: number;
  month: number;
  code: string;
  paymentId: number;
  profileId: number;
}

@Component({
  selector: 'app-caregiver-card',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './caregiver-card.component.html',
  styleUrl:   './caregiver-card.component.css'
})
export class CaregiverCardComponent implements OnInit {
  @Input() serviceSearch!: ServiceSearch;
  cards: Card[] = [];
  loadingList = false;
  posting = false;
  updating = false;
  deletingId: number | null = null;

  formModel: Partial<Card> = { number: '', holder: '', year: null, month: null, code: '', profileId: null, paymentId: null };

  private readonly API_BASE = 'https://cardmicro-dhbkhmbmb9hab4bc.canadacentral-01.azurewebsites.net/api/v1';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadCards();
  }

  loadCards(): void {
    this.loadingList = true;
    this.http.get<Card[]>(`${this.API_BASE}/cards`).subscribe({
      next: data => {
        this.cards = data;
        this.loadingList = false;
      },
      error: err => {
        console.error('Error loading cards', err);
        this.loadingList = false;
      }
    });
  }

  submitCard(): void {
    if (!this.formModel.number || !this.formModel.holder) return;
    this.posting = true;
    this.http.post<Card>(`${this.API_BASE}/cards`, this.formModel).subscribe({
      next: () => {
        this.snackBar.open('Card created', 'Close', { duration: 3000 });
        this.formModel = {} as Card;
        this.posting = false;
        this.loadCards();
      },
      error: err => {
        console.error('Error creating card', err);
        this.posting = false;
      }
    });
  }

  editCard(card: Card): void {
    this.formModel = { ...card };
    this.updating = true;
  }

  updateCard(): void {
    if (!this.formModel.id) return;
    this.updating = true;
    this.http.put<Card>(`${this.API_BASE}/cards/${this.formModel.id}`, this.formModel).subscribe({
      next: () => {
        this.snackBar.open('Card updated', 'Close', { duration: 3000 });
        this.formModel = {} as Card;
        this.updating = false;
        this.loadCards();
      },
      error: err => {
        console.error('Error updating card', err);
        this.updating = false;
      }
    });
  }

  deleteCard(id: number): void {
    this.deletingId = id;
    this.http.delete(`${this.API_BASE}/cards/${id}`).subscribe({
      next: () => {
        this.snackBar.open('Card deleted', 'Close', { duration: 3000 });
        this.deletingId = null;
        this.loadCards();
      },
      error: err => {
        console.error('Error deleting card', err);
        this.deletingId = null;
      }
    });
  }
}
