import { Routes } from '@angular/router';

import { LoginComponent } from './auth/pages/login/login.component';
import { SignUpComponent } from './auth/pages/sign-up/sign-up.component';
import { RootComponent as RootLayout } from './public/layout/root/root.component';
import { SearchPageComponent } from './search-caregivers/pages/search-page/search-page.component';
import { PaymentPageComponent } from './payments/pages/payment-page/payment-page.component';
import { ReservationListComponent } from './reservations/pages/reservation-list/reservation-list.component';
import { ServiceDetailComponent } from './search-caregivers/pages/service-detail/service-detail.component';
import { PaymentHistoryComponent } from './payments/pages/payment-history/payment-history.component';
import {ReviewPageComponent} from "./reviews/pages/review-page/review-page.component";

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
      {
        path: 'payment',
        component: PaymentPageComponent,
      },
      { path: 'payment/history', component: PaymentHistoryComponent },
      { path: 'search-caregiver/:id', component: ServiceDetailComponent },
      { path: 'your-service', component: ServiceDetailComponent },
      { path: 'reservations', component: ReservationListComponent },
      { path: 'review', component: ReviewPageComponent },
    ],
  },
];
