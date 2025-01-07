import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../models/user.model';
import { LoginResponse } from '../../../models/login-response.model';
import { Store } from '@ngrx/store';
import { selectAuthDetails } from '../../../store/auth/auth.selectors';
import { Cart } from '../../../models/cart.model';
import { updateCart } from '../../../store/cart/cart.actions';

@Component({
  selector: 'app-single-product-card',
  standalone: true,
  imports: [NgClass,CurrencyPipe,NgIf,RouterLink],
  templateUrl: './single-product-card.component.html',
  styleUrl: './single-product-card.component.scss'
})
export class SingleProductCardComponent {
  user:User | null | undefined;
  @Input() product?: Product;

    constructor(public productService:ProductService,private cartService:CartService,private toastrService:ToastrService,private store:Store<{auth:LoginResponse}>,private cartStore:Store<{cart:Cart}>){

       this.store.select(selectAuthDetails).subscribe({
                  next:(details)=>{
                      console.log("SingleProductCardComponent constructor: ",details);
                      this.user = details.user;
                  },
                  error:()=>{
                      console.log('in error block in constructor in SingleProductCardComponent');
                  }
                });
    }
   

    addToCartRequest(product:Product){
      if(!product.stock){
          this.toastrService.error("Product is not in stock");
          return;
      }
      // request to add item in cart
      if(this.user){
          this.cartService.addItemToCart(this.user?.userId,{productId:product.productId,quantity:1}).subscribe({
              next:cart=>{
                  console.log(cart);
                  this.toastrService.success("Item is added to cart !!");
                  this.cartStore.dispatch(updateCart({cart:cart}));
              },
              error:(error)=>{
                  console.log(error);
                  this.toastrService.error("Failed to add item to cart !!");
              }
          })
      }
      else{
        this.toastrService.error("Need to login first !!");
      }
}
}
