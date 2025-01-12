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
  constructor(private modalService:NgbModal,private helperService:HelperService,public productService:ProductService,private orderService:OrderService,private toastrService:ToastrService,private authService:AuthService){
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
}
