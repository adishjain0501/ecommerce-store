import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserViewComponent } from '../../common/user-view/user-view.component';
import { User } from '../../../models/user.model';
import { Store } from '@ngrx/store';
import { LoginResponse } from '../../../models/login-response.model';
import { selectAuthDetails } from '../../../store/auth/auth.selectors';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe, NgIf, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/user.service';
import { setLoginData } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [UserViewComponent,NgIf,FormsModule,UpperCasePipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
@ViewChild('productImage') productImageInput!: ElementRef;
    user?:User|null;
    previewImageUrl?: string;
    imageFile? :File;
    loginResponse?: LoginResponse;  
    constructor(private store:Store<{auth:LoginResponse}>,private modalService:NgbModal,private toastrService:ToastrService,private userService:UserService,private authStore:Store<{auth:LoginResponse}>){
        this.store.select(selectAuthDetails).subscribe({
                next:(loginData)=>{
                        this.user = JSON.parse(JSON.stringify(loginData.user));
                        this.loginResponse = loginData;
                }
              })
    }

    openUpdateModal(updateContent:any){
      if (this.user) {
        // this.previewImageUrl = this.user.
      this.modalService.open(updateContent,{
          size: 'lg',
          centered: true
      });
    }
    else{
      alert('User data is missing');
    }
  }

  imageFieldChanged(event: Event) {
    this.imageFile = (event.target as HTMLInputElement).files?.[0];
          console.log(this.imageFile);
          if(this.imageFile?.type == 'image/png' || this.imageFile?.type == 'image/jpeg'){
                //preview and upload file
                const reader = new FileReader();
                reader.onload = () => {
                  this.previewImageUrl = reader.result as string;
                };
                reader.readAsDataURL(this.imageFile);
          }
          else{
            this.toastrService.error("Only JPEG or PNG allowed!!");
            this.imageFile = undefined;
            this.productImageInput.nativeElement.value = '';  // Clear file input using ViewChild
          }
  }

  updateFormSubmitted(event:SubmitEvent){
      event.preventDefault();
      if(this.user?.name.trim()===''){
          this.toastrService.error("Name cannot be blank !!");
          return;
      }
      // apply rest of the validations
      if(this.user?.about.trim()===''){
        this.toastrService.error("About cannot be blank !!");
        return;
      }
      if(this.user?.password.trim()===''){
        this.toastrService.error("Password cannot be blank !!");
        return;
      }
      this.userService.updateUser(this.user as User).subscribe({
          next:(newUser)=>{
              console.log(newUser);
              const newLoginResponse = {
                  jwtToken:this.loginResponse?.jwtToken,
                  user: newUser,
                  isLoggedIn: this.loginResponse?.isLoggedIn
              }
              this.authStore.dispatch(setLoginData(newLoginResponse as LoginResponse));
              this.toastrService.success("Information Updated !!");
              // call image update api if new image is selected
              if(this.imageFile){
                  this.userService.uploadUserImage(this.user!.userId,this.imageFile).subscribe({
                      next:(data:any)=>{
                          console.log(data);
                          this.user!.imageName = data.imageName;
                          console.log(this.user);
                          const newLoginResponse = {
                            jwtToken:this.loginResponse?.jwtToken,
                            user: {...this.user,imageName:data.imageName},
                            isLoggedIn: this.loginResponse?.isLoggedIn
                        }
                          this.authStore.dispatch(setLoginData(newLoginResponse as LoginResponse));
                          this.toastrService.success(data.message);
                          this.imageFile = undefined;
                          this.previewImageUrl = '';
                          this.modalService.dismissAll();
                      },
                      error:error=>{
                          console.log(error);
                          this.toastrService.error("Error in updating image !!");
                      }
                  })
              }
              else{
                this.modalService.dismissAll();
              }
          },
          error:error=>{
              console.log(error);
              this.toastrService.error("Error while updating the data !!");
          }
      })
  }

}
