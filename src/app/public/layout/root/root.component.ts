import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MenuComponent, MatSidenavModule],
  templateUrl: './root.component.html',
  styleUrl: './root.component.css',
})
export class RootComponent {}
