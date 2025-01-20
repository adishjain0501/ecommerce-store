import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, map, Observable, switchMap, take, tap } from "rxjs";
import { LoginResponse } from "../models/login-response.model";
import { Store } from "@ngrx/store";
import { selectAuthDetails } from "../store/auth/auth.selectors";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from "./auth.service";
import { Console } from "console";

@Injectable()
export class JwtInterceptor implements HttpInterceptor{
    constructor(private store:Store<{auth:LoginResponse}>,private authService:AuthService){

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('jwt interceptor works');
        // write logic to add jwt token
        if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh-token')) {
            return next.handle(req);
          }
        if (req.headers.has('Authorization')) {
            return next.handle(req);
          }
        return this.store.select(selectAuthDetails).pipe(
            take(1), // Ensure you only take the latest value and don't stay subscribed
                switchMap(value=>{
                    console.log(value.jwtToken ,'from switch map');
                    // add token to header
                    if(this.authService.isJwtTokenExpired(value.jwtToken)){
                        console.log("from jwt interceptor token expired...");
                        return EMPTY;
                    }
                    if(value.isLoggedIn){
                        req = req.clone({
                            setHeaders: {
                              Authorization: `Bearer ${value.jwtToken}`
                            }
                          });
                    }
                    return next.handle(req);
                })
        )
        
    }

}