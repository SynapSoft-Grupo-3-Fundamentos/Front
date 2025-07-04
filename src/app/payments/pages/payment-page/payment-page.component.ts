// src/app/payments/pages/payment-page/payment-page.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { CreateEditPaymentDialogComponent } from '../../components/create-edit-payment-dialog/create-edit-payment-dialog.component';
import { PaymentMethodsService } from '../../services/payment-methods.service';
import { Card } from '../../model/card.entity';
import { PaymentCardComponent } from '../../components/payment-card/payment-card.component';

@Component({
  standalone: true,
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css'],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    PaymentCardComponent
  ]
})
export class PaymentPageComponent implements OnInit {
  cards: Card[] = [];
  user = JSON.parse(localStorage.getItem('user') || '{}');
  loading = false;

  constructor(
    private dialog: MatDialog,
    private paymentMethodsService: PaymentMethodsService
  ) {}

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.loading = true;
    this.paymentMethodsService.getByUserId(this.user.profileId.toString()).subscribe({
      next: (cards: Card[]) => {
        this.cards = cards;
        this.loading = false;
      },
      error: () => {
        console.warn('🟡 Backend caído, mostrando tarjetas simuladas');
        const fakeCards = JSON.parse(localStorage.getItem('fakeCards') || '[]');
        this.cards = fakeCards.filter((c: Card) => c.profileId === this.user.profileId);
        this.loading = false;
      },
    });
  }

  addEditCard(card?: Card): void {
    const dialogRef = this.dialog.open(CreateEditPaymentDialogComponent, {
      data: card || null
    });

    dialogRef.afterClosed().subscribe((result: Card) => {
      if (result) {
        this.loadCards();
      }
    });
  }

  removeCard(card: Card): void {
    this.cards = this.cards.filter(c => c.number !== card.number);
    let fakeCards = JSON.parse(localStorage.getItem('fakeCards') || '[]');
    fakeCards = fakeCards.filter((c: Card) => c.number !== card.number);
    localStorage.setItem('fakeCards', JSON.stringify(fakeCards));
  }
}
