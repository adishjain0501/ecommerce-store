import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Cart } from "../models/cart.model";

@Injectable({
  providedIn: 'root'
})
export class CartService {

    constructor(private httpClient:HttpClient){

    }
    // get user cart
    getCartOfUser(userId:string){
        return this.httpClient.get<Cart>(`${environment.baseUrl}/carts/${userId}`);
    }
    // add item to cart
    addItemToCart(userId:string,data:{productId:string,quantity:number}){
        return this.httpClient.post<Cart>(`${environment.baseUrl}/carts/${userId}`,data);
    }
    //empty cart
    emptyCart(userId:string){
        return this.httpClient.delete(`${environment.baseUrl}/carts/${userId}`);
    }

    removeItemFromCart(userId:string,itemId:number){
        return this.httpClient.delete(`${environment.baseUrl}/carts/${userId}/items/${itemId}`);
    }
}