import { Component, Input } from '@angular/core';
import { User } from '../../../auth/model/User';

@Component({
    selector: 'app-profile',
    imports: [],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent {
  @Input() user: User | undefined;
}
