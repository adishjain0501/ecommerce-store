import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginResponse } from '../../../models/login-response.model';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf } from '@angular/common';
import { selectAuthDetails } from '../../../store/auth/auth.selectors';
import { removeLoginData } from '../../../store/auth/auth.actions';
import { Observable } from 'rxjs';
import { Cart } from '../../../models/cart.model';

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
  cart?:Cart;
  constructor(private store:Store<{auth:LoginResponse}>,private router:Router,private authService:AuthService,private cartStore:Store<{cart:Cart}>){
    this.store.select(selectAuthDetails).subscribe({
        next:(loginData)=>{
          this.loginData = loginData;
          console.log(this.loginData);
        }
      })
      this.isAdmin = this.authService.checkLoginAndAdminUser();
      this.cartStore.select("cart").subscribe({
        next:data=>{
            this.cart = data;
        }
      })
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
