import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OrderRequest } from "../models/order.request.model";
import { environment } from "../../environments/environment";
import { Order, OrderResponse } from "../models/order.model";

@Injectable({
    providedIn: 'root'
  })
export class OrderService{

    constructor(private httpClient:HttpClient){}

    createOrder(orderRequest:OrderRequest){
        return this.httpClient.post(`${environment.baseUrl}/orders`,orderRequest);  
    }

    getAllOrders(pageNumber=0,pageSize=10,sortBy='orderedDate',sortDir="desc"){
        return this.httpClient.get<OrderResponse>(`${environment.baseUrl}/orders?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
    }

    getOrdersOfUser(userId:string){
        return this.httpClient.get<Order[]>(`${environment.baseUrl}/orders/users/${userId}`);
    }

    updateOrder(order:Order){
        return this.httpClient.put(`${environment.baseUrl}/orders/${order.orderId}`,order);
    }
    

}