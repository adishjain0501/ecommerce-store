export interface OrderRequest{
    billingName?:string;
    billingPhone:string;
    billingAddress:string;
    cartId:string;
    orderAStatus:OrderStatus;
    paymentStatus: PaymentStatus;
    userId:string;
}

export enum OrderStatus{
    PENDING="PENDING",
    DELIVERED="DELIVERED", 
    PROCESSING="PROCESSING",
    DISPATCHED="DISPATCHED"
}

export enum PaymentStatus{
    PAID="PAID",
    NOTPAID="NOTPAID"
}