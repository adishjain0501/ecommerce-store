import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import {LoginResponse} from '../models/login-response.model';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { selectAuthDetails } from '../store/auth/auth.selectors';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authDetails$!: Observable<LoginResponse>;
  constructor(
    private httpClient:HttpClient,
    private store:Store<{auth:LoginResponse}>,
    private toastr:ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  generateToken(loginData:{email:string,password:string}){
      return this.httpClient.post<LoginResponse>(`${environment.baseUrl}/auth/login`,loginData);
  }

  checkLoginAndNormalUser():Observable<boolean>{
    // login and normal user
    
    this.authDetails$ = this.store.select(selectAuthDetails);
    
    return this.authDetails$.pipe(
      tap((value: LoginResponse) => {
        console.log(value.isLoggedIn);
        console.log(value.jwtToken);
        console.log(value.user);
        console.log(value.user?.roles);
      }),
      map((value:LoginResponse) => {
        // condition for checking login
        
        const normalRoleObj = value.user?.roles.find(role=>{
          return role.roleName == environment.ROLE_NORMAL_NAME && role.roleId == environment.ROLE_NORMAL_ID;
        });
          console.log("in auth service checking for normal role: ",normalRoleObj);
          if(value.isLoggedIn && value.jwtToken && value.user && normalRoleObj){
            return true;
          }
          return false;
      })
    )
  }

  checkLoginAndAdminUser(){

  }

  showWarning(message:string){
    this.toastr.error(message);
  }

  // helper methods for local storage
   saveLoginDataToLocalStorage(loginData:LoginResponse){
    if(isPlatformBrowser(this.platformId)){
      localStorage.setItem('data',JSON.stringify(loginData));
    }
  }

    getLoginDataFromLocalStorage(){
 
    if(isPlatformBrowser(this.platformId)){// this function is used since using ssr
    const dataString = localStorage.getItem('data');
    if(dataString && dataString !== 'undefined'){
      return JSON.parse(dataString);
    }
      return {
        jwtToken: '',
        user: null,
        isLoggedIn: false
    };
  }
  return {
    jwtToken: '',
    user: null,
    isLoggedIn: false
};

  }

  removeLoginDataFromLocalStorage(){
    localStorage.removeItem('data');
  }
}
