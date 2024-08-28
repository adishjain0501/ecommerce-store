import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginResponse } from '../../../models/login-response.model';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf } from '@angular/common';
import { selectAuthDetails } from '../../../store/auth/auth.selectors';
import { removeLoginData } from '../../../store/auth/auth.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-custom-navbar',
  standalone: true,
  imports: [RouterModule,NgIf,AsyncPipe],
  templateUrl: './custom-navbar.component.html',
  styleUrl: './custom-navbar.component.scss',
})
export class CustomNavbarComponent {
  collapse = true;
  loginData!:LoginResponse;
  isAdmin?:Observable<boolean>;
  constructor(private store:Store<{auth:LoginResponse}>,private router:Router,private authService:AuthService){
    this.store.select(selectAuthDetails).subscribe({
        next:(loginData)=>{
          this.loginData = loginData;
          console.log(this.loginData);
        }
      })
      this.isAdmin = this.authService.checkLoginAndAdminUser();
  }
  toggle() {
    this.collapse = !this.collapse;
  }
  logout(){
    console.log('inside logout function');
    this.store.dispatch(removeLoginData());
    this.router.navigate(['/login']);
  }
}
