import { Component, EventEmitter, OnInit } from '@angular/core';
import { Order, OrderResponse } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { DatePipe, NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { OrderStatus, PaymentStatus } from '../../../models/order.request.model';
import { IInfiniteScrollEvent, InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { OrderCardComponent } from '../../common/order-card/order-card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderViewModalComponent } from '../../common/order-view-modal/order-view-modal.component';
import { HelperService } from '../../../services/helper.service';
import { OrderHubComponent } from '../../common/order-hub/order-hub.component';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [OrderHubComponent],
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.scss'
})
export class ViewOrdersComponent implements OnInit{
    orderResponse?: OrderResponse;
    // orderStatus = OrderStatus;
    // paymentStatus = PaymentStatus;
    pageNumber:number = 0;
    loading = false;
    openModalEvent = new EventEmitter<boolean>();
    constructor(private orderService: OrderService,private helperService:HelperService){}

    ngOnInit():void{
        this.loadPaginatedOrders(0);
    }

  loadPaginatedOrders(pageNumber=0,pageSize=5,sortBy='orderedDate',sortDir='desc') {
    this.loading = true;
    this.orderService.getAllOrders(pageNumber,pageSize,sortBy,sortDir).subscribe({
        next:(value)=>{
            console.log("ViewOrdersComponent loadPaginatedOrders: ",value);
            

            if(value.pageNumber && value.pageNumber > 0){
              this.orderResponse = {
                ...value,
                content:[...this.orderResponse!.content,...value.content]
              }
              console.log(this.orderResponse);
          }
          else{
            this.orderResponse = value;
            console.log("orders=> ", this.orderResponse);
          }
          this.loading = false;
        },
        error:error=>{
          console.log(error);
          this.loading = false;
        }
      })
  }

    onScroll(event:any){
          console.log("scrolling logged",event);
          if(this.loading || this.orderResponse?.lastPage){
              return;
          }
          // load the data of other pages
          this.pageNumber += 1; 
          this.loadPaginatedOrders(this.pageNumber);
      }

      openModal(order:Order){
          console.log("open modal called");
          this.helperService.emitOrderEvent(order);
      }
      
}
