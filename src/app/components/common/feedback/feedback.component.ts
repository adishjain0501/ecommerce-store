import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Feedback } from '../../../models/feedback.model';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FormsModule,NgIf],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
    constructor(private toastrService:ToastrService){}
    feedback: Feedback = new Feedback();
    imagePreview: string | ArrayBuffer | null = null;
    onSubmit() {
      if(!this.feedback.name){
        this.toastrService.error("Name is empty !!");
        return;
      }
      if(!this.feedback.email){
        this.toastrService.error("Email is empty !!");
        return;
      }
      else if(!this.feedback.phoneNo){
          this.toastrService.error("Phone number is empty !!");
      }
      else if(!this.feedback.feedback){
        this.toastrService.error("Feedback is empty !!");
       }
      console.log("FeedbackComponent onSubmit: ",this.feedback);
      // Add logic to send feedback data to backend
      // Example HTTP request
      // this.http.post('your-backend-endpoint', this.feedback).subscribe(response => {
      //   console.log('Feedback submitted successfully!', response);
      // });
    }

    onFileSelected(event:Event){
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.feedback.image = input.files[0];
        // Show image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.feedback.image);
      }
    }

}
