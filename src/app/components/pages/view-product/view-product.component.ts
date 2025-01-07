import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { CurrencyPipe, JsonPipe, NgClass, NgIf } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { LoginResponse } from '../../../models/login-response.model';
import { Store } from '@ngrx/store';
import { selectAuthDetails } from '../../../store/auth/auth.selectors';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { updateCart } from '../../../store/cart/cart.actions';
import { Cart } from '../../../models/cart.model';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [JsonPipe,NgIf,NgClass,CurrencyPipe,RouterLink],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss'
})
export class ViewProductComponent {
    productId?:string;
    product?:Product;
    user?:User|null;
    constructor(private activatedRoute:ActivatedRoute,public productService:ProductService,private titleService:Title,private store:Store<{auth:LoginResponse}>,private cartService:CartService,private toastrService:ToastrService,private cartStore:Store<{cart:Cart}>){
        this.activatedRoute.params.subscribe(param=>{
            this.productId = param['productId'];
            console.log("ViewProductComponent constructor: ",this.productId);
            this.loadProduct();
        })
        this.store.select(selectAuthDetails).subscribe({
            next:(details)=>{
                console.log("ViewProductComponent constructor: ",details);
                this.user = details.user;
            },
            error:()=>{
                console.log('in error block in constructor in ViewProductComponent');
            }
          });
    }

  loadProduct() {
      if(this.productId){
          this.productService.getProduct(this.productId).subscribe({
              next: data=>{
                  console.log(data);
                  this.product = data;
                  this.titleService.setTitle(data.title+' | Electronic Store');
              }
          })
      }
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
