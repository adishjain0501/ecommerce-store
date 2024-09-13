import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { SingleCategoryViewComponent } from "../../common/single-category-view/single-category-view.component";
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-view-categories',
  standalone: true,
  imports: [NgFor, SingleCategoryViewComponent,SweetAlert2Module,FormsModule,NgIf],
  templateUrl: './view-categories.component.html',
  styleUrl: './view-categories.component.scss'
})
export class ViewCategoriesComponent implements OnInit{
  categories:Category[] = [];
  selectedCategory?:Category;
  updateView = false;
  // categories = [
    //   {
    //     categoryId:'',
    //     title:'Clothing',
    //     description:'This is clothing category',
    //     coverImage: 'https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg'
    //   },
    //   {
    //     categoryId:'',
    //     title:'Sports',
    //     description:'This is Sports category',
    //     coverImage: 'https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg'
    //   },
    //   {
    //     categoryId:'',
    //     title:'Books',
    //     description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //     coverImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    //   },
    //   {
    //     categoryId:'',
    //     title:'Books',
    //     description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //     coverImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    //   }
    // ]
  constructor(private categoryService:CategoryService,
    private modalService:NgbModal,
  private toastrService:ToastrService){}
  ngOnInit(): void {
      this.categoryService.getCategories().subscribe({
        next:(resp)=>{
            console.log("getCategory response: ",resp);
            this.categories = resp.content;
        }
      })
  }
    
    open(content: TemplateRef<any>,category:Category) {
      this.selectedCategory = {...category};
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title',animation:true,backdrop:true })
      .result.then((res)=>{
          console.log(res);
      })
      .catch((err)=>{
          console.log(err);
      })
      .finally(()=>{
          console.log("Modal close");
          this.updateView = false;
      })
      ;
    }

    deleteCategory(){
      Swal.fire({
        title: "Are you sure you want to delete category "+this.selectedCategory?.title+"?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.categoryService.deleteCategory(this.selectedCategory!.categoryId).subscribe({
          next:(data)=>{
              console.log(data);
              // this.toastrService.success('Category deleted');
              Swal.fire({
                title: "Deleted!",
                text: "Category "+this.selectedCategory?.title+" has been deleted.",
                icon: "success"
              });
              //close view dialog
              this.modalService.dismissAll();
              this.categories = this.categories.filter(cat=>{
                return cat.categoryId != this.selectedCategory?.categoryId
              });
              this.selectedCategory = undefined;
          },
          error:(error)=>{
              console.log(error);
              this.toastrService.error('Error in deleting category');
          }
        })
         
        }
      });   
    }

    update(){
      this.updateView = true;
    }

    updateCategoryDetails(){
      this.updateView = false;
      this.categoryService.updateCategory(this.selectedCategory!).subscribe({
        next:(result)=>{
            console.log(result);
            this.toastrService.success("Category Updated");
            this.categories = this.categories.map(cat=>{
              if(cat.categoryId === this.selectedCategory?.categoryId){
                  cat.title = result.title;
                  cat.description = result.description;
                  cat.coverImage = result.coverImage;
                  return cat;
              }
              return cat;
            })
        },
        error:(err)=>{
            console.log(err);
            this.toastrService.error("Error in updating category");
        }
      })
    }
}
