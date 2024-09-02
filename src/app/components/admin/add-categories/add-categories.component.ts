import { Component } from '@angular/core';
import { IconsModule } from '../../../helper/icons/icons.module';
import { Category } from '../../../models/category.model';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-add-categories',
  standalone: true,
  imports: [IconsModule,FormsModule,JsonPipe],
  templateUrl: './add-categories.component.html',
  styleUrl: './add-categories.component.scss'
})
export class AddCategoriesComponent {

  category:Category = new Category('','','','');
  constructor(private toastr:ToastrService,private categoryService:CategoryService){}
  formSubmitted(event:SubmitEvent){
      event.preventDefault();
      console.log(this.category);
      if(this.category.title.trim()===''){
        this.toastr.warning('Title is required !!');
        return;
      }
      if(this.category.description.trim()===''){
        this.toastr.warning('Description is required !!');
        return;
      }
      if(this.category.coverImage.trim()===''){
        this.toastr.warning('Cover Image Url is required !!');
        return;
      }
      //submit the form to server
      this.categoryService.createCategory(this.category).subscribe({
        next:(result)=>{
            console.log('category added, result: ',result);
            this.toastr.success('Category added to database !!');
            this.category = new Category('','','','');
        },
        complete:()=>{
            console.log('data stream completed successfully');
        },
        error:(errorObj)=>{
            console.log(errorObj);
            this.toastr.error('Error in adding category');
        }
      })
  }

  resetAddCategoryForm(){
    this.category = new Category('','','','');
  }
}
