import { ErrorHandler, Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root',
  })
export class GlobalErrorHandler implements ErrorHandler{
    
    handleError(error: any): void {
        console.error('In global error handler, an error occurred:', error);
        if(error.status == 401){
          alert("Token expired, please login again !!");
        }
        
      }

}