import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Card } from '../../model/card.entity';

@Component({
    selector: 'app-payment-form',
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
    ],
    templateUrl: './payment-form.component.html',
    styleUrl: './payment-form.component.css'
})
export class PaymentFormComponent {
  newCard: Card = new Card();
  @Output() addCard = new EventEmitter<Card>();

  onSubmit() {
    if (
      this.newCard.profileId &&
      this.newCard.holder &&
      this.newCard.number &&
      this.newCard.month &&
      this.newCard.year &&
      this.newCard.code
    ) {
      this.addCard.emit(this.newCard);
      this.newCard = new Card();
    }
  }
}
