import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../auth/model/User';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    ProfileComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  user?: User;

  menuList = [
    {
      name: 'Search Caregivers',
      link: '/search-caregiver',
      icon: 'search',
      role: 'tutor',
    },
    {
      name: 'Your Reservations',
      link: '/reservations',
      icon: 'book-open-blank-variant-outline',
      role: 'all',
    },
    {
      name: 'Payment methods',
      link: '/payment',
      icon: 'credit_card',
      role: 'all',
    },
    {
      name: 'Your service',
      link: '/your-service',
      icon: 'book-open-blank-variant-outline',
      role: 'caregiver',
    },
  ];

  filteredMenuList: typeof this.menuList = [];

  ngOnInit(): void {
    this.user = JSON.parse(
      window.localStorage.getItem('user') ?? 'null'
    ) as User;

    if (!this.user) return;

    this.filteredMenuList = this.menuList.filter(
      (menu) => menu.role === this.user?.role || menu.role === 'all'
    );
  }

  logout($event: MouseEvent) {
    $event.preventDefault();
    window.localStorage.removeItem('user');
  }
}
