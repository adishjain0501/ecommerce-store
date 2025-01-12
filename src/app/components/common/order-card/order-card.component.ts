import { Component, Input } from '@angular/core';
import { Order } from '../../../models/order.model';
import { DatePipe, NgClass, NgIf, UpperCasePipe } from '@angular/common';
import { OrderStatus, PaymentStatus } from '../../../models/order.request.model';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [NgIf,NgClass,UpperCasePipe,DatePipe],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss'
})
export class OrderCardComponent {
  @Input() order?:Order;
   orderStatus = OrderStatus;
   paymentStatus = PaymentStatus;
}
