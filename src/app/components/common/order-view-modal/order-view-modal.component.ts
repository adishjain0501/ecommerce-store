import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService } from '../../../services/helper.service';
import { Order } from '../../../models/order.model';
import { AsyncPipe, CurrencyPipe, DatePipe, KeyValuePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { OrderRequest, OrderStatus, PaymentStatus } from '../../../models/order.request.model';
import { ProductService } from '../../../services/product.service';
import { Observable, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { PaymentService } from '../../../services/payment.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-order-view-modal',
  standalone: true,
  imports: [NgIf,DatePipe,NgClass,NgFor,CurrencyPipe,KeyValuePipe,FormsModule,AsyncPipe],
  templateUrl: './order-view-modal.component.html',
  styleUrl: './order-view-modal.component.scss'
})
export class OrderViewModalComponent implements OnInit,OnDestroy{
  order?:Order
  closeResult:any;
  @ViewChild("content") content?:ElementRef;
  public paymentStatus? = PaymentStatus;
  public orderStatus? = OrderStatus;
  // public orderKeys = Object.keys(OrderStatus) as Array<keyof typeof OrderStatus>; // Extract keys for iteration
  public modalSubscription?:Subscription;
  updateState?:boolean = false;
  isAdmin:Observable<boolean>;
  constructor(private modalService:NgbModal,private helperService:HelperService,public productService:ProductService,private orderService:OrderService,private toastrService:ToastrService,private authService:AuthService,private paymentService:PaymentService,private router:Router){
    this.isAdmin = this.authService.checkLoginAndAdminUser();
  }

  ngOnInit(): void {
    console.log("subscribing");
    this.modalSubscription  = this.helperService.openOrderModalEmitter.subscribe({
      next:(data:Order)=>{
          console.log("output from modal view: ",data);
          this.order = data;
          this.open(this.content);
      }
    });
  }

  ngOnDestroy(): void {
      if(this.modalSubscription){
        console.log("unsubscribing");
        this.modalSubscription.unsubscribe();
      }
  }
  
  open(content:any){
        this.modalService.open(content,{
          size: 'xl'
        });
  }

  updateStateMethod(){
    this.updateState = !this.updateState;
  }

  compareFnOrderStatus (optionValue: any,modelValue: any):boolean  {
    return  optionValue === modelValue;
  }

  compareFnPaymentStatus(optionValue: any,modelValue: any):boolean{
    return  optionValue === modelValue;
  }

  updateOrder(){
      console.log("updated order: ",this.order);
      if(this.order){
        this.orderService.updateOrder(this.order).subscribe({
          next:(data:any)=>{
              console.log(data);
              this.toastrService.success("Order updated successfully !!");
          },
          error:error=>{
            console.log(error);
            this.toastrService.success("Error in updating order!!");
          }
        })
      }
  }

  payForOrder(order:Order | undefined){
    if(order){
        // initiate payment
this.paymentService.initiatePayment(order.orderId).subscribe({
  next:(res:any)=>{
      console.log(res);
      const subscription = this.paymentService.payWithRazorpay({
        amount: order.orderAmount,
        razorpayOrderId: res.razorpayOrderId,
        userName: order.user.name,
        email: order.user.email,
        contact: "+919745345434"
      }).subscribe({
        next:res1=>{
          //success
          console.log("from cart component success payment response: ",res1);
          subscription.unsubscribe();
          // server verification call
          this.paymentService.captureAndVerifyPayment(order.orderId,res1).subscribe({
            next:(responseReceived:any)=>{
                console.log(responseReceived);
                this.toastrService.success(responseReceived.message);
                this.modalService.dismissAll();
                this.router.navigate(["/store"]);
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
    

  }
}
