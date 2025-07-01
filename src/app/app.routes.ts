import { Routes } from '@angular/router';

import { LoginComponent } from './auth/pages/login/login.component';
import { SignUpComponent } from './auth/pages/sign-up/sign-up.component';
import { RootComponent as RootLayout } from './public/layout/root/root.component';
import { SearchPageComponent } from './search-caregivers/pages/search-page/search-page.component';
import { PaymentPageComponent } from './payments/pages/payment-page/payment-page.component';
import { PaymentHistoryComponent } from './payments/pages/payment-history/payment-history.component';
import {ReviewPageComponent} from "./reviews/pages/review-page/review-page.component";
import {SupportPageComponent} from "./support/pages/support-page/support-page.component";
import {ServiceSearchService} from "./search-caregivers/services/service-search.service";
import {ReservationPageComponent} from "./reservations/pages/reservation-page/reservation-page.component";

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
      {path: 'payment', component: PaymentPageComponent,},
      { path: 'payment/history', component: PaymentHistoryComponent },
      //{ path: 'search-caregiver/:id', component: ServiceDetailComponent },
      { path: 'your-service', component: ServiceSearchService },
      { path: 'reservations', component: ReservationPageComponent},
      { path: 'review', component: ReviewPageComponent },
      { path: 'support', component: SupportPageComponent },
    ],
  },
];
