import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PaymentMethodsService } from '../../services/payment-methods.service';
import { Card } from '../../model/card.entity';

@Component({
  selector: 'app-create-edit-payment-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './create-edit-payment-dialog.component.html',
  styleUrl: './create-edit-payment-dialog.component.css'
})
export class CreateEditPaymentDialogComponent {
  public editMode: boolean;
  public user = JSON.parse(window.localStorage.getItem('user') || '{}');

  public cardForm = new FormGroup({
    cardNumber: new FormControl('', [Validators.required]),
    cardHolder: new FormControl('', [Validators.required]),
    cvv: new FormControl('', [Validators.required]),
    expirationDate: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<CreateEditPaymentDialogComponent>,
    public paymentMethodsService: PaymentMethodsService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data?: Card
  ) {
    this.editMode = !!data;

    if (this.editMode) {
      this.cardForm.patchValue({
        cardHolder: data?.holder,
        cardNumber: data?.number,
        cvv: data?.code,
        expirationDate: data?.month + '/' + data?.year,
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onAddCard() {
    const exp = this.cardForm.value.expirationDate?.split('/') ?? [];
    const month = exp[0] ?? '';
    const year = exp[1]?.length === 2 ? '20' + exp[1] : exp[1];

    const card: Card = {
      profileId: this.user.profileId,
      holder: this.cardForm.value.cardHolder ?? '',
      number: this.cardForm.value.cardNumber ?? '',
      code: this.cardForm.value.cvv ?? '',
      month: parseInt(month),
      year: parseInt(year),
    };


    this.paymentMethodsService.create(card).subscribe({
      next: (res) => {
        this.snackBar.open('Tarjeta registrada correctamente', 'Cerrar', {
          duration: 3000
        });
        this.dialogRef.close(res);
      },
      error: (err) => {
        console.error('Error al guardar tarjeta:', err);
        this.snackBar.open('Error al registrar tarjeta', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  onEditCard() {
    const exp = this.cardForm.value.expirationDate?.split('/') ?? [];
    const month = exp[0] ?? '';
    const year = exp[1] ?? '';

    const card: Card = {
      profileId: this.user.profileId,
      holder: this.cardForm.value.cardHolder ?? '',
      number: this.cardForm.value.cardNumber ?? '',
      code: this.cardForm.value.cvv ?? '',
      month: parseInt(month),
      year: parseInt(year),
    };

    this.paymentMethodsService.updateCard(this.data?.id, card).subscribe({
      next: (res) => {
        this.snackBar.open('Tarjeta actualizada correctamente', 'Cerrar', {
          duration: 3000
        });
        this.dialogRef.close(res);
      },
      error: (err) => {
        console.error('Error al actualizar tarjeta:', err);
        this.snackBar.open('Error al actualizar tarjeta', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  onSubmit() {
    if (this.cardForm.invalid) {
      this.snackBar.open('Completa todos los campos antes de guardar', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    if (this.editMode) {
      this.onEditCard();
    } else {
      this.onAddCard();
    }
  }
}
