import { Component, OnInit } from '@angular/core';
import { PaymentFormComponent } from '../../components/payment-form/payment-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Card } from '../../model/card.entity';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CreateEditPaymentDialogComponent } from '../../components/create-edit-payment-dialog/create-edit-payment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentMethodsService } from '../../services/payment-methods.service';
import { DeletePaymentDialogComponent } from '../../components/delete-payment-dialog/delete-payment-dialog.component';
import { PaymentCardComponent } from '../../components/payment-card/payment-card.component';

@Component({
    selector: 'app-payment-page',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIcon,
        PaymentCardComponent,
        RouterLink,
    ],
    templateUrl: './payment-page.component.html',
    styleUrl: './payment-page.component.css'
})
export class PaymentPageComponent implements OnInit {
  cards: Card[] = [];
  showForm = false;
  paymentSuccess: boolean = false;
  user = JSON.parse(window.localStorage.getItem('user') || '{}');

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private paymentMethodsService: PaymentMethodsService
  ) {}

  ngOnInit(): void {
    this.paymentMethodsService
      .getByUserId(this.user.profileId)
      .subscribe((cards) => {
        this.cards = cards;
      });
  }

  addEditCard(card?: Card) {
    const editMode = !!card?.id;

    const dialogRef = this.dialog.open(CreateEditPaymentDialogComponent, {
      data: editMode ? card : null,
    });

    dialogRef.afterClosed().subscribe((card) => {
      if (!card) return;

      if (editMode) {
        const index = this.cards.findIndex((c) => c.id === card.id);
        this.cards[index] = card;
      } else this.cards.push(card);

      const message = editMode
        ? 'Card updated successfully'
        : 'Card added successfully';

      this.snackBar.open(message, 'Close', {
        duration: 2000,
      });
    });
  }

  removeCard(card: Card) {
    if (!card?.id) return;

    const dialogRef = this.dialog.open(DeletePaymentDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'delete') return;

      this.paymentMethodsService.delete(card?.id).subscribe(() => {
        this.snackBar.open('Card removed successfully', 'Close', {
          duration: 2000,
        });
        this.cards = this.cards.filter((c) => c !== card);
      });
    });
  }
}
