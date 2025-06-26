import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import {User} from "../../model/User";
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sign-up',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {
  userForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    document: new FormControl(''),
    phone: new FormControl(''),
    password: new FormControl(''),
    rePassword: new FormControl(''),
  });

  showPassword: boolean = false;
  showRePassword: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  toggleShowPassword(event: MouseEvent) {
    this.showPassword = !this.showPassword;
    event.stopPropagation();
  }

  toggleShowRePassword(event: MouseEvent) {
    this.showRePassword = !this.showRePassword;
    console.log(this.userForm.value);
    event.stopPropagation();
  }

  signUp() {
    const user: Omit<User, 'id'> = {
      fullName: `${this.userForm.value.firstName} ${this.userForm.value.lastName}`,
      email: this.userForm.value.email || '',
      document: this.userForm.value.document || '',
      phone: this.userForm.value.phone || '',
      password: this.userForm.value.password || '',
      role: 'tutor',
      profileImg: '',
    };

    if (this.userForm.value.password !== this.userForm.value.rePassword) return;

    if (
      !this.userForm.value.email ||
      !this.userForm.value.document ||
      !this.userForm.value.phone ||
      !this.userForm.value.password
    )
      return;

    this.authService.signUp(user).subscribe((user) => {
      window.localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/search-caregiver']);
    });

    console.log(this.userForm.value);

    // this.router.navigate(['/search-caregiver']);
  }
}
