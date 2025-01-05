import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IconsModule } from '../../../helper/icons/icons.module';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { setCategoryData } from '../../../store/category/category.actions';
import { Product } from '../../../models/product.model';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../services/product.service';
import { QuillModule } from 'ngx-quill';
import { ImageData } from '../../../models/image-data.model';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [IconsModule,NgFor,FormsModule,JsonPipe,QuillModule,NgIf],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit{
  @ViewChild('productImage') productImageInput!: ElementRef;
  categories:Category[]=[];
  product = new Product();
  imageData:ImageData = {
    previewImageUrl:'',
    file:undefined
  }
  constructor(private catService:CategoryService,private categoryStore:Store<{cat:Category[]}>,
    private toastrService:ToastrService,private productService:ProductService
  ){}
  
  ngOnInit(): void {
    // loading categories
      this.categoryStore.select('cat').pipe(take(1)).subscribe({
        next:(categories)=>{
            if(categories.length > 0){
              console.log('categories found in store...');
              this.categories = categories;
            }
            else{
              console.log('no categories found in store..., loading from server');
                this.catService.getCategories().subscribe({
                  next:(categories)=>{
                      console.log(categories);
                      this.categories = categories.content;
                      this.categoryStore.dispatch(setCategoryData({categories:this.categories}));
                  }
                })
            }
        }
      })
  }

  compareFn (optionValue: any,modelValue: any):boolean  {
      return optionValue && modelValue ? optionValue.categoryId === modelValue.categoryId : optionValue === modelValue;
    }

    formSubmitted(event:SubmitEvent){
        event.preventDefault();
        //validate data
        if(this.product.title.trim()===''){
          this.toastrService.error("Title is required !!");
          return;
        }
        if(this.product.description.trim()===''){
          this.toastrService.error("Description is required !!");
          return;
        }
        if(this.product.quantity <= 0){
          this.toastrService.error("Quantity must be > 0 !!");
          return;
        }
        if(this.product.price <= 0){
          this.toastrService.error("Price must be > 0 !!");
          return;
        }
        if(this.product.discountedPrice <= 0 || (this.product.discountedPrice > this.product.price)){
          this.toastrService.error("Provide correct discounted value value > 0 and value < price!!");
          return;
        }
        if(this.product.category.categoryId===''){
          this.toastrService.error("Category needs to be selected!!");
          return;
        }
        else{
          // add product with category
          this.productService.createProductWithCategory(this.product).subscribe({
              next:(data)=>{
                console.log("Product created with data: ",data);
                this.toastrService.success("Product created id "+data.productId);
                this.product = new Product();
                // image upload...
                this.productService.uploadProductImage(data.productId,this.imageData.file!).subscribe({
                    next: data=>{
                        console.log(data);
                        this.toastrService.success("product image also updated...");
                        this.imageData = {
                            previewImageUrl:'',
                            file:undefined
                        }
                        this.productImageInput.nativeElement.value = '';
                    },
                    error: error=>{
                      console.log(error);
                      this.toastrService.error("Error in uploading image...");
                    }
                })
              },
              error:error=>{
                console.log(error);
                this.toastrService.error("Error in creating product !!");
              }
          });
        }
      }

      imageFieldChanged(event:Event){
          this.imageData.file = (event.target as HTMLInputElement).files?.[0];
          console.log(this.imageData.file);
          if(this.imageData.file?.type == 'image/png' || this.imageData.file?.type == 'image/jpeg'){
                //preview and upload file
                const reader = new FileReader();
                reader.onload = () => {
                  this.imageData.previewImageUrl = reader.result as string;
                };
                reader.readAsDataURL(this.imageData.file);
          }
          else{
            this.toastrService.error("Only JPEG or PNG allowed!!");
            this.imageData.file = undefined;
            this.productImageInput.nativeElement.value = '';  // Clear file input using ViewChild
          }
      }

      onFormReset() {
        this.imageData.previewImageUrl = ''; // Clear preview image
        this.imageData.file = undefined; // Clear the file object
        this.productImageInput.nativeElement.value = ''; // Clear file input (if ViewChild is used)
      }
}

