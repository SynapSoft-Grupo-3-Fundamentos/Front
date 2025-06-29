import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Card {
  id?: number;
  number?: string;
  holder: string;
  year?: number;
  month?: number;
  code?: string;
  profileId?: number;
  paymentId?: number;
}

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit {
  cards: Card[] = [];
  user = JSON.parse(window.localStorage.getItem('user') || '{}');
  cardForm!: FormGroup;
  selectedCard?: Card;
  editMode = false;
  showForm = false;

  private readonly CARD_API = 'https://cardmicro-dhbkhmbmb9hab4bc.canadacentral-01.azurewebsites.net/api/v1/cards';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCards();
    this.cardForm = new FormGroup({
      cardNumber: new FormControl('', Validators.required),
      cardHolder: new FormControl('', Validators.required),
      expirationDate: new FormControl('', Validators.required),
      cvv: new FormControl('', Validators.required),
    });
  }

  loadCards() {
    this.http
      .get<Card[]>(`${this.CARD_API}/get-by-profile-id/${this.user.profileId}`)
      .subscribe((res) => (this.cards = res));
  }

  openForm(card?: Card) {
    this.editMode = !!card;
    this.selectedCard = card;
    this.showForm = true;
    if (card) {
      this.cardForm.setValue({
        cardHolder: card.holder,
        cardNumber: card.number,
        expirationDate: `${card.month}/${card.year}`,
        cvv: card.code,
      });
    } else {
      this.cardForm.reset();
    }
  }

  closeForm() {
    this.showForm = false;
  }

  submitCard() {
    const form = this.cardForm.value;
    const [month, year] = form.expirationDate.split('/');

    const newCard: Card = {
      holder: form.cardHolder,
      number: form.cardNumber,
      code: form.cvv,
      month: parseInt(month),
      year: parseInt(year),
      profileId: this.user.profileId,
      paymentId: 0
    };

    if (this.editMode && this.selectedCard?.id) {
      newCard.id = this.selectedCard.id;
      this.http
        .put<Card>(`${this.CARD_API}/${this.selectedCard.id}`, newCard)
        .subscribe((res) => {
          const idx = this.cards.findIndex((c) => c.id === res.id);
          this.cards[idx] = res;
          this.snackBar.open('Card updated', 'Close', { duration: 2000 });
          this.closeForm();
        });
    } else {
      this.http
        .post<Card>(this.CARD_API, newCard)
        .subscribe((res) => {
          this.cards.push(res);
          this.snackBar.open('Card added', 'Close', { duration: 2000 });
          this.closeForm();
        });
    }
  }

  deleteCard(card: Card) {
    if (!card.id) return;
    if (!confirm('Are you sure you want to delete this card?')) return;

    this.http.delete(`${this.CARD_API}/${card.id}`).subscribe(() => {
      this.cards = this.cards.filter((c) => c.id !== card.id);
      this.snackBar.open('Card deleted', 'Close', { duration: 2000 });
    });
  }
}
