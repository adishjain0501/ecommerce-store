import { Component } from '@angular/core';
import { Cart } from '../../../models/cart.model';
import { LoginResponse } from '../../../models/login-response.model';
import { Store } from '@ngrx/store';
import { CartService } from '../../../services/cart.service';
import { User } from '../../../models/user.model';
import { selectAuthDetails } from '../../../store/auth/auth.selectors';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

    cart?:Cart;
    user:User | undefined | null;
    constructor(private store:Store<{auth:LoginResponse}>,private cartService:CartService,private toastrService:ToastrService,private router:Router){
      this.store.select(selectAuthDetails).subscribe({
            next:(details)=>{
                console.log("ViewProductComponent constructor: ",details);
                if(!details.isLoggedIn){
                  this.toastrService.error("Please login first !!");
                  this.router.navigate(['/login']);
                }
                this.user = details.user;
                
                    this.loadCart();
                
            },
            error:()=>{
                console.log('in error block in constructor in ViewProductComponent');
            }
          });
    }

  loadCart() {
    if(this.user){
      this.cartService.getCartOfUser(this.user.userId).subscribe({
        next:cart=>{
            console.log(cart);
            this.cart = cart;
            console.log(this.cart);
        },
        error:error=>{
          console.log(error);
          this.toastrService.error("Error in loading cart!!");
        }
      })
    }
  }
}
