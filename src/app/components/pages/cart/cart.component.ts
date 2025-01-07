import { Component } from '@angular/core';
import { Cart, CartItem } from '../../../models/cart.model';
import { LoginResponse } from '../../../models/login-response.model';
import { Store } from '@ngrx/store';
import { CartService } from '../../../services/cart.service';
import { User } from '../../../models/user.model';
import { selectAuthDetails } from '../../../store/auth/auth.selectors';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CartItemComponent } from '../../common/cart-item/cart-item.component';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { updateCart } from '../../../store/cart/cart.actions';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent,NgFor,NgIf,CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

    cart?:Cart;
    user:User | undefined | null;
    constructor(private store:Store<{auth:LoginResponse}>,public cartService:CartService,private toastrService:ToastrService,private router:Router,private cartStore:Store<{cart:Cart}>){
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
            this.cartStore.dispatch(updateCart({"cart":this.cart}));
        },
        error:error=>{
          console.log(error);
          this.toastrService.error("Error in loading cart!!");
        }
      })
    }
  }

  increaseQuantity(cartItem:CartItem){
    const quantityToUpdate = cartItem.quantity + 1;
    if(quantityToUpdate > cartItem.product.quantity){
      this.toastrService.error("Selected quantity not available !!");
      return;
    }
      this.updateQuantity(cartItem,quantityToUpdate);
  }

  decreaseQuantity(cartItem:CartItem){
    const quantityToUpdate = cartItem.quantity - 1;
    if(quantityToUpdate <= 0){
      // this.toastrService.error("Quantity must be > 0 !!");
      this.deleteMethodCall(cartItem);
      return;
    }
    this.updateQuantity(cartItem,quantityToUpdate);
  }

  updateQuantity(cartItem:CartItem,quantity:number){
    this.cartService.addItemToCart(this.user?.userId as string,{productId:cartItem.product.productId,quantity:quantity}).subscribe({
      next:cart=>{
          this.toastrService.success("Quantity updated !!");
          this.cart = cart;
          this.cartStore.dispatch(updateCart({cart:cart}));
      },error:err=>{
        console.error("error from updateQuantity in cart component: ",err);
        if(err.status == 401){
          this.toastrService.error("Token expired, please login again !!");
        }
        else{
          this.toastrService.error("Error in updating !!");
        }
       
      }
    })
  }

  deleteItem(cartItem:CartItem){
    this.deleteMethodCall(cartItem);
  }


  private deleteMethodCall(cartItem: CartItem) {
    this.cartService.removeItemFromCart(this.user?.userId as string, cartItem.cartItemId).subscribe({
      next: (data: any) => {
        console.log("CartComponent deleteItem next: ", data);
        if (data.success) {
          this.toastrService.success("Item removed !!");
          if (this.cart) {
            this.cart = {
              ...this.cart,
              items: this.cart.items.filter(item => item.cartItemId !== cartItem.cartItemId)
            };
            this.cartStore.dispatch(updateCart({ cart: this.cart }));
          }

        }
      },
      error: err => {
        console.error("CartComponent deleteItem error: ", err);
        this.toastrService.error("Error in removing item from cart !!");
      }
    });
  }
}
