import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Store } from '@ngrx/store';
import { LoginResponse } from '../../../models/login-response.model';
import { selectAuthDetails } from '../../../store/auth/auth.selectors';
import { User } from '../../../models/user.model';
import { Order, OrderResponse } from '../../../models/order.model';
import { OrderCardComponent } from '../../common/order-card/order-card.component';
import { OrderHubComponent } from '../../common/order-hub/order-hub.component';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [OrderCardComponent,OrderHubComponent],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit{
  user?:User;
  orderResponse?:OrderResponse = {
    content: []
  };
  orders?:Order[];
  constructor(private orderService:OrderService,private store:Store<{auth:LoginResponse}>){
    this.store.select(selectAuthDetails).subscribe({
      next:(details)=>{
          console.log("ViewProductComponent constructor: ",details);
          this.user = details.user as User;
      },
      error:()=>{
          console.log('in error block in constructor in ViewProductComponent');
      }
});
  }

  ngOnInit(){
        if(this.user){
          this.orderService.getOrdersOfUser(this.user.userId).subscribe({
            next:data=>{
                console.log(data);
                this.orderResponse!.content = data.sort((a,b)=>{
                    return Number(b.orderedDate) - Number(a.orderedDate);
                });
            }
          })
        }
  }

  onScroll(event:any){
      console.log("my-orders onScroll printing event: ",event);
  }

}
