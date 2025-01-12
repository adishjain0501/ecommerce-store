import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderCardComponent } from '../order-card/order-card.component';
import { OrderViewModalComponent } from '../order-view-modal/order-view-modal.component';
import { NgFor, NgIf } from '@angular/common';
import { Order, OrderResponse } from '../../../models/order.model';
import { IInfiniteScrollEvent, InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { HelperService } from '../../../services/helper.service';

@Component({
  selector: 'app-order-hub',
  standalone: true,
  imports: [OrderCardComponent,OrderViewModalComponent,NgIf,InfiniteScrollDirective,NgFor],
  templateUrl: './order-hub.component.html',
  styleUrl: './order-hub.component.scss'
})
export class OrderHubComponent {
  @Input() orderResponse?:OrderResponse;
  @Output() onScrollEvent = new EventEmitter();
  constructor(private helperService:HelperService){}

   onScroll(event:IInfiniteScrollEvent){
            this.onScrollEvent.emit(event);
        }
  
        openModal(order:Order){
            console.log("open modal called");
            this.helperService.emitOrderEvent(order);
        }
}
