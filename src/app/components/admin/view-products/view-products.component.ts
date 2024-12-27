import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Product, ProductsResponse } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe, JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module,SweetAlert2LoaderService } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Store } from '@ngrx/store';
import { Category } from '../../../models/category.model';
import { setCategoryData } from '../../../store/category/category.actions';
import { QuillModule } from 'ngx-quill';
import { ImageData } from '../../../models/image-data.model';

@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [NgFor,NgIf,NgClass,NgbPagination,SweetAlert2Module,FormsModule,QuillModule,JsonPipe,CurrencyPipe],
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.scss',
  providers: [SweetAlert2LoaderService]
})
export class ViewProductsComponent implements OnInit{
    product!: Product;
    productsResponse?:ProductsResponse;
    oldProductResponse?:ProductsResponse;
    update:boolean = false;
    @ViewChild('productImage') productImageInput!: ElementRef;
    categories:Category[] = [];
    searchQuery:string = '';
    searchMode:boolean = false;
    imageData:ImageData = {
        previewImageUrl:'',
        file:undefined
      }
    constructor(public productService:ProductService,
      private toastrService:ToastrService,private modalService:NgbModal,private categoryService:CategoryService,private categoryStore:Store<{cat:Category[]}>){}

      ngOnInit(): void {
          console.log("ViewProductsComponent");
          this.loadProducts(0);
      }

      loadProducts(pageNumber=0){
        this.productService.getAllProducts(pageNumber,2,'addedDate','desc').subscribe({
          next:productResponse=>{
              this.productsResponse = productResponse;
              console.log("ViewProductsComponent: ",this.productsResponse);
          }
        })
      }

      open(content: TemplateRef<any>,product:Product) {
        this.update = false;
        this.modalService.open(content, { 
          ariaLabelledBy: 'modal-basic-title',
          size: 'xl'
        });
        this.product = product;

        // loading category from store or backend
        this.categoryService.getCategoriesFromStore().subscribe({
          next:categories=>{
              if(categories.length > 0){
                this.categories = categories;
              }
              else{
                // load the data from server
                this.categoryService.getCategories().subscribe({
                  next:categoryResponse=>{
                      this.categoryStore.dispatch(setCategoryData({categories:categoryResponse.content}));
                      console.log("done");
                  }
                })
              }
          }
      })
    }

      pageChange(page: number) {
          console.log(page);
          if(this.searchMode){
            this.productSearchService(page-1);
          }
          // when user changes page without searching in normal mode
          else{
            this.loadProducts(page-1);
          }
      }

      yesDeleteProduct(event:Event,product:Product){
        // alert("deleted: "+event+", product id: "+product.productId);
        this.productService.deleteProduct(product.productId).subscribe({
          next:(data:any)=>{
              // this.toastrService.success("Product deleted !!");
              this.toastrService.success(data.message);
              console.log(data);
              if(this.productsResponse && this.productsResponse.content){
                  this.productsResponse.content = this.productsResponse?.content.filter(p=>{
                    return p.productId !== product.productId;
                  });
            }
          },
          error:error=>{
              console.log(error);
              this.toastrService.error("Error in deleting product !!");
          }
        });
      }

      toggleUpdateView(content:any,product:Product){
        this.update= true;
        this.product = product;
        this.modalService.open(content, { 
          ariaLabelledBy: 'modal-basic-title',
          size: 'xl'
        });
      }

      compareFn (optionValue: any,modelValue: any):boolean  {
        return optionValue && modelValue ? optionValue.categoryId === modelValue.categoryId : optionValue === modelValue;
      }
     
  updateFormSubmitted(event: SubmitEvent) {
    event.preventDefault();
    //validate data
    if (this.product) {
      if (this.product.title == null || this.product.title.trim() === '') {
        this.toastrService.error("Title is required !!");
        return;
      }
      if (this.product.description == null || this.product.description.trim() === '') {
        this.toastrService.error("Description is required !!");
        return;
      }
      if (this.product.quantity <= 0) {
        this.toastrService.error("Quantity must be > 0 !!");
        return;
      }
      if (this.product.price <= 0) {
        this.toastrService.error("Price must be > 0 !!");
        return;
      }
      if (this.product.discountedPrice <= 0 || (this.product.discountedPrice > this.product.price)) {
        this.toastrService.error("Provide correct discounted value value > 0 and value < price!!");
        return;
      }

      // log 
      console.log("submit the form");
      this.productService.updateProduct(this.product).subscribe({
        next:data=>{
            this.toastrService.success("Product Updated !!");
            this.product = data;
            // image upload...
          if (this.imageData.file && this.imageData.previewImageUrl) {
            this.productService.uploadProductImage(data.productId, this.imageData.file!).subscribe({
              next: data => {
                console.log(data);
                this.toastrService.success("product image also updated...");
                this.imageData = {
                  previewImageUrl: '',
                  file: undefined
                }
              },
              error: error => {
                console.log(error);
                this.toastrService.error("Error in uploading image...");
              }
            })
          }
        },
        error:error=>{
            console.error("View Product Component updateFormSubmitted error: ",error);
            this.toastrService.error("Error in updating product ||");
        }
      });
    }
  }

  updateProductCategory(){
    console.log("updating category...");
    if(this.product){
      this.productService.updateCategoryOfProduct(this.product.productId,this.product.category.categoryId).subscribe({
          next: data=>{
              console.log("ViewProductComponent updateProductCategory =>",data);
              this.product = data;
              this.toastrService.success("Product category updated !!");
              
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

// search product method
searchProduct(){
    if(this.searchQuery.trim() === ''){
        this.toastrService.error("Search Query Required !!");
        console.log(this.oldProductResponse);
        // if old data is present set old product data back to display if search string is empty
        if(this.oldProductResponse){
            this.productsResponse = this.oldProductResponse;
            this.searchMode = false;
        }
        return;
    }

    this.productSearchService(0);
}

productSearchService(pageNumber:number=0,pageSize:number=10,sortBy:string='title',sortDir:string='asc'){
  console.log("page number",pageNumber);
  this.productService.searchProduct(this.searchQuery,pageNumber,pageSize,sortBy,sortDir).subscribe({
    next: data=>{
      // below if is executed when called from page change
      if(this.searchMode == true){
          this.productsResponse = data;
      }
      // first time search
      else{
        this.oldProductResponse = this.productsResponse;
        this.productsResponse = data;
        this.searchMode = true;
        console.log(data);
      }
        
      }
    })
}

restoreOldData(){
  console.log("test");
  if(this.searchQuery.trim() == '' && this.oldProductResponse){
    this.productsResponse = this.oldProductResponse;
    this.oldProductResponse = undefined;
    this.searchMode = false;
  }
}

}
