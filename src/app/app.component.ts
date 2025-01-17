import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomNavbarComponent } from './components/common/custom-navbar/custom-navbar.component';
import { AuthService } from './services/auth.service';
import { Store } from '@ngrx/store';
import { LoginResponse } from './models/login-response.model';
import { selectAuthDetails } from './store/auth/auth.selectors';
import { CartService } from './services/cart.service';
import { Cart } from './models/cart.model';
import { User } from './models/user.model';
import { updateCart } from './store/cart/cart.actions';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { setLoginData } from './store/auth/auth.actions';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomNavbarComponent,NgxUiLoaderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  showAdditionalInfo = false;

  constructor(private toastr: ToastrService,private authService:AuthService,private store:Store<{auth:LoginResponse}>,private cartService:CartService,private cartStore:Store<{cart:Cart}>,private socialAuthService:SocialAuthService,private router:Router) {
      this.socialAuthService.authState.subscribe({
          next:(user)=>{
              console.log("user: ",user);
              this.authService.signInWithGoogle(user).subscribe({
                  next:(data:LoginResponse)=>{
                      console.log(data);
                      this.store.dispatch(setLoginData(data));
                      this.router.navigate(['/user']);
                  },
                  error:error=>{
                    console.error(error);
                    this.toastr.error("Error in login from backend !!");
                  }
              })
          },
          error:error=>{
            console.log(error);
          }
      })
  }
  title = 'ecommerce-web-app';
  user?: User | null;
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
  }

  // reading ngrx store value using selector and updating to local storage whenever the login data is updated in the ngrx store 
  updateLocalStorageWithLoginResponse() {
    this.store.select(selectAuthDetails).subscribe({
        next:(details)=>{
            console.log("saving loginData from app component to local storage: ",details);
            this.authService.saveLoginDataToLocalStorage(details);
            this.user = details.user;
        },
        error:()=>{
            console.log('in error block in ngoninit in app component-  while getting user details');
        }
      });
      if(this.user){
        console.log("printing user data in app component: ",this.user);
        this.cartService.getCartOfUser(this.user.userId).subscribe({
          next:cartData=>{
              this.cartStore.dispatch(updateCart({cart:cartData}));
          }
        })
      }
     

  }

  showToastr() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
