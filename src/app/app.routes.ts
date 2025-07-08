import { Routes } from '@angular/router';

import { LoginComponent } from './auth/pages/login/login.component';
import { SignUpComponent } from './auth/pages/sign-up/sign-up.component';
import { RootComponent as RootLayout } from './public/layout/root/root.component';
import { SearchPageComponent } from './search-caregivers/pages/search-page/search-page.component';
import { PaymentPageComponent } from './payments/pages/payment-page/payment-page.component';
import { PaymentHistoryComponent } from './payments/pages/payment-history/payment-history.component';
import { ReviewPageComponent } from './reviews/pages/review-page/review-page.component';
import { SupportPageComponent } from './support/pages/support-page/support-page.component';
import { ReservationPageComponent } from './reservations/pages/reservation-page/reservation-page.component';
import { SearchDetailComponent } from './search-caregivers/pages/service-detail/service-detail.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: RootLayout,
    children: [
      { path: 'search-caregiver', component: SearchPageComponent },
      { path: 'payment', component: PaymentPageComponent },
      { path: 'payment/history', component: PaymentHistoryComponent },
      { path: 'your-service', component: SearchDetailComponent },
      { path: 'search-caregiver/:id', component: SearchDetailComponent },
      { path: 'reservations', component: ReservationPageComponent },
      { path: 'review', component: ReviewPageComponent },
      { path: 'support', component: SupportPageComponent },
    ],
  },
];
