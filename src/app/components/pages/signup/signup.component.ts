import { Component } from '@angular/core';
import { User } from '../../../models/user.model';
import { FormsModule, NgForm } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PasswordValidatorDirective } from '../../../directives/password-validator.directive';
import { UserService } from '../../../services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [FormsModule,JsonPipe,NgIf,PasswordValidatorDirective,RouterModule],
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {

  user = new User('','','','male','',[]);
  loading:boolean = false;
  constructor(private toastr:ToastrService,private userService:UserService){

  }

  formSubmit(event:SubmitEvent,signUpForm:NgForm){
    event.preventDefault();
    console.log("submit event: %o, signUpForm: %o",event,signUpForm);
    console.log(signUpForm.controls["name"].value);
    if(signUpForm.valid){
      // submit the form
      console.log("user",signUpForm.value);
      this.loading = true;
      this.userService.signupUser(this.user).subscribe({
        next:(user)=>{
          //success
          this.toastr.success("User is successfully registered !!!");
          console.log("success user",user);
          this.user = new User('','','','male','',[]);
          signUpForm.resetForm({gender:this.user.gender});
          
        },
        error:(error)=>{
          //error
          this.toastr.error("Error in creating user !! This email might exists, try with another one");
          console.log(error);
          this.loading = false;
        },
        complete:()=>{// complete block is not same as finally only executed in case of success scenario
          this.loading = false;
          console.log("completed");
        }
      });
    }
    else{
      this.toastr.error('Form is not valid !!!');
    }
  }

  resetForm(signUpForm: NgForm){
    this.user = new User('','','','male','',[]);
    signUpForm.resetForm({gender:this.user.gender});//key should be same as name attribute
  }
}
