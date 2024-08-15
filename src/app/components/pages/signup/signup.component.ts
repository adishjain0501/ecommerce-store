import { Component } from '@angular/core';
import { User } from '../../../models/user.model';
import { FormsModule, NgForm } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';
import { log } from 'console';
import { ToastrService } from 'ngx-toastr';
import { PasswordValidatorDirective } from '../../../directives/password-validator.directive';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [FormsModule,JsonPipe,NgIf,PasswordValidatorDirective],
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {

  user = new User('','','','male','');
  constructor(private toastr:ToastrService){

  }

  formSubmit(event:SubmitEvent,signUpForm:NgForm){
    event.preventDefault();
    console.log("submit event: %o, signUpForm: %o",event,signUpForm);
    console.log(signUpForm.controls["name"].value);
    if(signUpForm.valid){
      // submit the form
      console.log("user",signUpForm.value);
    }
    else{
      this.toastr.error('Form is not valid !!!','',{
        positionClass: 'toast-top-right'
      });
    }
  }
}
