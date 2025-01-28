import { Component, OnInit } from '@angular/core';
import { ProductsResponse } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { SingleProductCardComponent } from '../../common/single-product-card/single-product-card.component';
import { CategoriesViewComponent } from '../../common/categories-view/categories-view.component';
import { IInfiniteScrollEvent, InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [InfiniteScrollDirective,NgFor,NgIf,NgClass,SingleProductCardComponent,CategoriesViewComponent,FormsModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent implements OnInit{
    productsResponse?:ProductsResponse;
    loading:boolean = false;
    pageNumber:number = 0;
    searchQuery:string = '';
    oldProductResponse?:ProductsResponse;
    
    constructor(public productService:ProductService,private toastrService:ToastrService){

    }
  ngOnInit(): void {
      this.loadLiveProducts(this.pageNumber);
  }

  loadLiveProducts(pageNumber=0,pageSize=4,sortBy='addedDate',sortDir='desc'){
    this.productService.getLiveProducts(pageNumber,pageSize,sortBy,sortDir).subscribe({
      next:(productsResponse)=>{
          if(this.pageNumber === 0){
            
            this.productsResponse = productsResponse;
            console.log("StoreComponent loadLiveProducts in if: ",this.productsResponse);
          }
          else{
            this.productsResponse = {
              ...productsResponse,
              content:[...this.productsResponse!.content,...productsResponse.content]
            }
            console.log("StoreComponent loadLiveProducts in else: ",this.productsResponse);
          }
          
      }
    })
  }

  productSearchService(pageNumber:number=0,pageSize:number=10,sortBy:string='title',sortDir:string='asc'){
    console.log("page number",pageNumber);
    this.productService.searchProduct(this.searchQuery,pageNumber,pageSize,sortBy,sortDir).subscribe({
      next: data=>{
       
          this.oldProductResponse = this.productsResponse;
          this.productsResponse = data;
          
          console.log(data);
        
          
        }
      })
  }

 onScroll(event:IInfiniteScrollEvent){
       console.log("scrolling logged",event);
       if(this.loading || this.productsResponse?.lastPage){
           return;
       }
      //  // load the data of other pages
       this.pageNumber += 1; 
       this.loadLiveProducts(this.pageNumber);
   }

   searchProduct(){
    // if old data is present set old product data back to display if search string is empty
    if(this.searchQuery.trim() === ''){
        this.toastrService.error("Search Query Required !!");
        console.log(this.oldProductResponse);
        if(this.oldProductResponse){
            this.productsResponse = this.oldProductResponse;
            
        }
        return;
    }
    //else if search string is entered and search button is clicked by the user, call search api
    this.productSearchService(0);
}

   restoreOldData(){
    console.log("StoreComponent restoreOldData");
    if(this.searchQuery.trim() == '' && this.oldProductResponse){
      this.productsResponse = this.oldProductResponse;
      this.oldProductResponse = undefined;
      
    }
  }
}
