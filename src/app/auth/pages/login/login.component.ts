import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/User';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  userForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  showPassword = false;

  toggleShowPassword(event: MouseEvent) {
    this.showPassword = !this.showPassword;
    event.stopPropagation();
  }

  ngOnInit() {
    const data = window.localStorage.getItem('user');

    const user: User | null = data ? JSON.parse(data) : null;

    if (!user) return;

    if (user.role === 'caregiver') this.router.navigate(['/your-service']);
    else this.router.navigate(['/search-caregiver']);
  }

  login() {
    const { email, password } = this.userForm.value;

    if (!email || !password) return;

    this.authService
      .loginAsCaregiver(decodeURI(email), password)
      .subscribe((user) => {
        if (!user) {
          this.authService
            .loginAsTutor(decodeURI(email), password)
            .subscribe((user) => {
              if (!user) return;
              window.localStorage.setItem(
                'user',
                JSON.stringify({ ...user, role: 'tutor' })
              );

              this.router.navigate(['/your-service']);
            });
        }

        window.localStorage.setItem(
          'user',
          JSON.stringify({ ...user, role: 'caregiver' })
        );

        if (user.role === 'caregiver') this.router.navigate(['/your-service']);
        else this.router.navigate(['/search-caregiver']);
      });
  }

  loginAsTutorDemoBtn() {
    // this.authService
    //   .loginAsTutor('juan.perez@example.com', 'juan123')
    //   .subscribe((user) => {
    //     window.localStorage.setItem(
    //       'user',
    //       JSON.stringify({ ...user, role: 'tutor' })
    //     );
    //
    //     this.router.navigate(['/search-caregiver']);
    //   });
    this.router.navigate(['/search-caregiver']);
    //TODO: Guardar el id del usuario en el local storage
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        role: 'tutor',
        fullName: 'Marco Denegri',
        profileImg: 'https://randomuser.me/api/portraits/men/1.jpg',
        profileId: 3,
      })
    );
  }

  loginAsCaregiverDemoBtn() {
    // this.authService
    //   .loginAsCaregiver('maria.lopez@example.com', 'maria123')
    //   .subscribe((user) => {
    //     window.localStorage.setItem(
    //       'user',
    //       JSON.stringify({ ...user, role: 'caregiver' })
    //     );
    //
    //     this.router.navigate(['/your-service']);
    //   });
    this.router.navigate(['/your-service']);
    //TODO: Guardar el id del usuario en el local storage
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        role: 'caregiver',
        fullName: 'Marco Denegri',
        profileImg: 'https://randomuser.me/api/portraits/men/2.jpg',
        profileId: 4,
      })
    );
  }
}
