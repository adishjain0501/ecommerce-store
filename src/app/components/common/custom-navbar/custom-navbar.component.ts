import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-custom-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './custom-navbar.component.html',
  styleUrl: './custom-navbar.component.scss',
})
export class CustomNavbarComponent {
  collapse = true;
  toggle() {
    this.collapse = !this.collapse;
  }
}
