import { Component, OnDestroy } from '@angular/core';
import { Cart, CartItem } from '../../../models/cart.model';
import { LoginResponse } from '../../../models/login-response.model';
import { Store } from '@ngrx/store';
import { CartService } from '../../../services/cart.service';
import { User } from '../../../models/user.model';
import { selectAuthDetails } from '../../../store/auth/auth.selectors';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { CartItemComponent } from '../../common/cart-item/cart-item.component';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { removeCart, updateCart } from '../../../store/cart/cart.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderRequest, OrderStatus, PaymentStatus } from '../../../models/order.request.model';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Subscription } from 'rxjs';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent,NgFor,NgIf,CurrencyPipe,RouterLink,FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnDestroy {

    cart?:Cart;
    user:User | undefined | null;
    orderRequest?:OrderRequest={
      billingName: '',
      billingPhone: '',
      billingAddress: '',
      paymentStatus:PaymentStatus.NOTPAID,
      orderAStatus:OrderStatus.PENDING,
      userId: '',
      cartId: ''
    };
    private userSubscription?:Subscription;
    constructor(private store:Store<{auth:LoginResponse}>,public cartService:CartService,private toastrService:ToastrService,private router:Router,private cartStore:Store<{cart:Cart}>,private modalService:NgbModal,private orderService:OrderService,private paymentService:PaymentService){
      this.userSubscription = this.store.select(selectAuthDetails).subscribe({
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

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  loadCart() {
    if(this.user){
      this.cartService.getCartOfUser(this.user.userId).subscribe({
        next:cart=>{
            console.log(cart);
            this.cart = cart;
            console.log(this.cart);
            this.cartStore.dispatch(updateCart({"cart":this.cart}));
            if(this.orderRequest){
              this.orderRequest.userId = this.user?.userId as string;
              this.orderRequest.cartId = this.cart.cartId;
            }
            console.log(this.orderRequest);
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

  clearCart(){
    if(this.user){
      this.cartService.clearCart(this.user.userId).subscribe({
        next:(data:any)=>{
            console.log(data);
            if(data.success){
                this.toastrService.success("Cart Cleared !!");
                if(this.cart){
                this.cart = {
                  ...this.cart,
                  items:[]
                };
                this.cartStore.dispatch(updateCart({cart:this.cart}));
              }
                
            }
        },
        error:error=>{
          console.log(error);
        }
      })
    }
  }

  openOrderPlaceModal(modalContent:any){  
      if(this.cart && this.cart?.items.length > 0){
        this.modalService.open(modalContent,{
          size: 'lg',
          animation:true
        });
      }
  }

  createOrderFormSubmitted(event:SubmitEvent){
      event.preventDefault();
      // validation
      if(this.orderRequest?.billingName?.trim()===''){
        this.toastrService.warning("Billing Name is required !!");
        return;
      }
      if(this.orderRequest?.billingPhone?.trim()===''){
        this.toastrService.warning("Billing Phone is required !!");
        return;
      }
      if(this.orderRequest?.billingAddress?.trim()===''){
        this.toastrService.warning("Billing Address is required !!");
        return;
      }
      console.log(this.orderRequest);
      this.orderService.createOrder(this.orderRequest as OrderRequest).subscribe({
        next:(data:any)=>{
            console.log("createOrder response: ",data);
            this.toastrService.success("Order created !!","",{
              positionClass:'toast-bottom-center'
            });
            this.toastrService.info("Processing for the payment...","",{
                positionClass:'toast-bottom-center'
            });
            this.modalService.dismissAll();
            this.loadCart();
            // initiate payment
            this.paymentService.initiatePayment(data.orderId).subscribe({
                next:(res:any)=>{
                    console.log(res);
                    const subscription = this.paymentService.payWithRazorpay({
                      amount: data.orderAmount,
                      razorpayOrderId: res.razorpayOrderId,
                      userName: data.user.name,
                      email: data.user.email,
                      contact: "+919745345434"
                    }).subscribe({
                      next:res1=>{
                        //success
                        console.log("from cart component success payment response: ",res1);
                        subscription.unsubscribe();
                        // server verification call
                        this.paymentService.captureAndVerifyPayment(data.orderId,res1).subscribe({
                          next:(responseReceived:any)=>{
                              console.log(responseReceived);
                              this.toastrService.success(responseReceived.message);
                          },
                          error:error=>{
                              console.error("payment verification error: ",error);
                              this.toastrService.error("Error in Capturing Payment and Payment Verification !!");
                          }
                        })

                      },
                      error:error=>{
                          // error
                          console.log("from cart component error payment response: ",error);
                          this.toastrService.error("error in doing payment, you can retry from orders section !!");
                          subscription.unsubscribe();
                      }
                    })
                }
            })
        }
      })

  }
}
