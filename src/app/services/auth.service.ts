import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import {LoginResponse} from '../models/login-response.model';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { selectAuthDetails } from '../store/auth/auth.selectors';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { SocialUser } from '@abacritt/angularx-social-login';
import { removeLoginData } from '../store/auth/auth.actions';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  authDetails$!: Observable<LoginResponse>;
  constructor(
    private httpClient:HttpClient,
    private store:Store<{auth:LoginResponse}>,private modalService:NgbModal,
    private toastr:ToastrService,private router:Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  generateToken(loginData:{email:string,password:string}){
      return this.httpClient.post<LoginResponse>(`${environment.baseUrl}/auth/login`,loginData);
  }

  signInWithGoogle(user: SocialUser) {
      return this.httpClient.post<LoginResponse>(`${environment.baseUrl}/auth/google`,user);
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

  checkLoginAndAdminUser():Observable<boolean>{
// login and normal user
this.authDetails$ = this.store.select(selectAuthDetails);
    
return this.authDetails$.pipe(
  tap((loginResponse: LoginResponse) => {
    console.log('login response after getting login data from store',loginResponse);
  }),
  map((loginResp:LoginResponse) => {
    // condition for checking login
    const adminRoleObj = loginResp.user?.roles.find(role=>{
      return role.roleName == environment.ROLE_ADMIN_NAME && role.roleId == environment.ROLE_ADMIN_ID;
    });
      console.log("in auth service checking for normal role: ",adminRoleObj);
      if(loginResp.isLoggedIn && loginResp.jwtToken && loginResp.user != null && adminRoleObj != null){
        return true;
      }
      return false;
  })
)
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

    getLoginDataFromLocalStorage():LoginResponse{
    if(isPlatformBrowser(this.platformId)){// this condition was used since I was using SSR earlier, now no need since switched back to CSR
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
  }
 }

 public isJwtTokenExpired(token:any){
  const jwtHelperService = new JwtHelperService();
  console.log("checking token expiration...token value: ",token);
  if(token){
    console.log("token found...");
    if(jwtHelperService.isTokenExpired(token)){
      console.log("token has expired...");
      this.toastr.error("Session expired !!");
      this.store.dispatch(removeLoginData());
      this.modalService.dismissAll();
      this.router.navigate(['/login']);
      return true;
    }
    else{
      console.log("Token still valid...");
      return false;
    }
  }
  return false;
}

}
