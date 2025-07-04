import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../model/payment.entity';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-payment-history',
  imports: [CommonModule, MatTableModule, RouterLink, MatButtonModule],
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.css'
})
export class PaymentHistoryComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user') || '{}');

  paymentListData: Payment[] = [];
  displayedColumns = ['id', 'date', 'amount', 'subject', 'last-digits'];

  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    this.paymentService
      .getByUserId(this.user.id)
      .subscribe((payments) => {
        this.paymentListData = payments;
      });
  }
}
