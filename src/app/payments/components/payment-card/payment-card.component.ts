import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Card } from '../../model/card.entity';

@Component({
    selector: 'app-payment-card',
    imports: [MatCardModule, MatIconModule, MatButtonModule],
    templateUrl: './payment-card.component.html',
    styleUrl: './payment-card.component.css'
})
export class PaymentCardComponent {
  @Input() card!: Card;

  @Output() onDelete: EventEmitter<Card> = new EventEmitter();
  @Output() onEdit: EventEmitter<Card> = new EventEmitter();

  handleDelete() {
    this.onDelete.emit(this.card);
  }

  handleEdit() {
    this.onEdit.emit(this.card);
  }
}
