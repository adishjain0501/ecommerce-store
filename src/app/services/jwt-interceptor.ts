import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, switchMap, take, tap } from "rxjs";
import { LoginResponse } from "../models/login-response.model";
import { Store } from "@ngrx/store";
import { selectAuthDetails } from "../store/auth/auth.selectors";

@Injectable()
export class JwtInterceptor implements HttpInterceptor{
    constructor(private store:Store<{auth:LoginResponse}>){

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
        return next.handle(req);
    }

}