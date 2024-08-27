import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomNavbarComponent } from './components/common/custom-navbar/custom-navbar.component';
import { AuthService } from './services/auth.service';
import {  setLoginData } from './store/auth/auth.actions';
import { Store } from '@ngrx/store';
import { LoginResponse } from './models/login-response.model';
import { isPlatformBrowser } from '@angular/common';
import { selectAuthDetails } from './store/auth/auth.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  showAdditionalInfo = false;

  constructor(private toastr: ToastrService,private authService:AuthService,private store:Store<{auth:LoginResponse}>) {
    // const x = signal<number>(5);
    // console.log("x="+x());
    // const y = signal(3);
    // console.log("y="+y());
    // const z = computed(()=>{
    //   return x() + y()
    // });
    // console.log("z="+z());
    // x.set(10);
    // console.log("x="+x());
    // console.log("z="+z());
    // let arr = [12,23,34,45];
    // let n = arr.with(2,24);
    // console.log(arr);
    // console.log(n)
  }
  title = 'ecommerce-web-app';

  showInfo() {
    this.showAdditionalInfo = true;
    setTimeout(() => {
      this.showAdditionalInfo = false;
      console.log('Reset happened');
    }, 3000);
  }

  ngOnInit(){
    console.log('in app component listening to store change');
      this.updateLocalStorageWithLoginResponse();
    
    
    // const loginData = this.authService.getLoginDataFromLocalStorage();
    // console.log('in app component login response from local storage',loginData);
    // if(loginData.isLoggedIn && loginData.user != null && loginData.jwtToken){
    //   this.store.dispatch(setLoginData({ ...loginData }));
    // }
    
  }

  // reading ngrx store value using selector
  updateLocalStorageWithLoginResponse() {
    this.store.select(selectAuthDetails).subscribe({
        next:(details)=>{
            console.log("saving loginData from app component to local storage: ",details);
            this.authService.saveLoginDataToLocalStorage(details);
        },
        error:()=>{
            console.log('in error block in ngoninit in app component');
        }
      });
  }

  showToastr() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
