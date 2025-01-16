import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

declare var Razorpay:any;

@Injectable({
    providedIn: 'root'
})
export class PaymentService{
    constructor(private httpClient:HttpClient){}

    initiatePayment(orderId:string){
        return this.httpClient.post(`${environment.baseUrl}/payments/initiate-payment/${orderId}`,{});
    }

    payWithRazorpay(paymentOption:{
        amount:number,razorpayOrderId:string,userName:string,email:string,contact:string
    }){
        const subject = new Subject<any>();
        const options = {
            "key": environment.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
            "amount": paymentOption.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Substring Technologies",
            "description": "You will receive email after payment",
            "image": "https://substringtechnologies.com/_next/static/media/vector1.84a10a16.svg",
            "order_id": paymentOption.razorpayOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response:any){
                console.log("payment id: ",response.razorpay_payment_id);
                console.log("order id: ",response.razorpay_order_id);
                console.log("signature: ",response.razorpay_signature);
                subject.next({
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentSignature: response.razorpay_signature
                     })   
                
            },
            "prefill": {
                "name": paymentOption.userName,
                "email": paymentOption.email,
                "contact": paymentOption.contact
            },
            "notes": {
                "address": ""
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        const pay = new Razorpay(options);
        
        // e.preventDefault();
        pay.on('payment.failed', function (response:any){
            console.log("error code: ",response.error.code);
            console.log("error description: ",response.error.description);
            console.log("error source: ",response.error.source);
            console.log("error step: ",response.error.step);
            console.log("error reason: ",response.error.reason);
            console.log("error order_id: ",response.error.metadata.order_id);
            console.log("error payment_id: ",response.error.metadata.payment_id);
            subject.error(response.error);
        });
        pay.open();
        return subject;
    }

    captureAndVerifyPayment(orderId:string,paymentData:any){
        return this.httpClient.post(`${environment.baseUrl}/payments/verify-and-save-payment/${orderId}`,paymentData);
    }
}