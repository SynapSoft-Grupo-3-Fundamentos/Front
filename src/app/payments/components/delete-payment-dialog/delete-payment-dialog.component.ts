import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-payment-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-payment-dialog.component.html',
  styleUrl: './delete-payment-dialog.component.css',
})
export class DeletePaymentDialogComponent {}
