import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { LoginResponse } from '../../../models/login-response.model';
import { Store } from '@ngrx/store';
import { setLoginData } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [RouterModule,FormsModule,JsonPipe],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  loginData:any = {
    email:'',
    password:''
  }

  constructor(private toastrService:ToastrService,private authService:AuthService, 
    private store:Store<{auth:LoginResponse}>,private router:Router
  ){
    
  }

  submitForm(event:SubmitEvent){
      // event.preventDefault(); // ng submit handles it automatically, so no need to call explicitly
      console.log(this.loginData);
      if(!this.loginData.email.trim() || !this.loginData.password.trim()){
        this.toastrService.error("Values Required !!");
        return;
      }
      //login api
      this.authService.generateToken(this.loginData).subscribe({
        next:(loginResponse:LoginResponse)=>{
          console.log(loginResponse);
          this.store.dispatch(setLoginData(loginResponse));
          this.router.navigate(['/user']);
        },
        complete:()=>{
            console.log("login api call completed successfully and token generated");
        },
        error:(errorObj)=>{
          console.log(errorObj);
          this.toastrService.error(errorObj.error.message);
        }
      });
  }

}
