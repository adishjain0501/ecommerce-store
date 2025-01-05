import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesViewComponent } from '../../common/categories-view/categories-view.component';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../../services/product.service';
import { CategoryPaginatedResponse } from '../../../models/category.model';
import { ProductsResponse } from '../../../models/product.model';
import { SingleProductCardComponent } from '../../common/single-product-card/single-product-card.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { IInfiniteScrollEvent, InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-store-categories',
  standalone: true,
  imports: [CategoriesViewComponent,SingleProductCardComponent,NgClass,InfiniteScrollDirective,NgFor,NgIf,RouterLink],
  templateUrl: './store-categories.component.html',
  styleUrl: './store-categories.component.scss'
})
export class StoreCategoriesComponent {

  categoryId?:string;
  categoryTitle?:string;
  productsResponse?:ProductsResponse;
  loading:boolean = false;
  pageNumber:number = 0;
  constructor(private activatedRoute:ActivatedRoute,private titleService:Title,private productService:ProductService){
      this.activatedRoute.paramMap.subscribe(params=>{
          this.categoryId = params.get("categoryId") as string;
          console.log("categoryId: ",this.categoryId);
          this.categoryTitle = params.get("categoryTitle") as string;
          console.log("categoryTitle: ",this.categoryTitle);
          this.titleService.setTitle(this.categoryTitle+": ECommerce");
          this.loadCategoryProducts(this.categoryId);
      });
  }

  loadCategoryProducts(categoryId:string,pageNumber=0,pageSize=3,sortBy='addedDate',sortDir='desc'){
    this.productService.getProductsOfCategory(categoryId,pageNumber,pageSize,sortBy,sortDir).subscribe({
        next:data=>{
          if(this.pageNumber === 0){
            
            this.productsResponse = data;
            console.log("StoreComponent loadLiveProducts in if: ",this.productsResponse);
          }
          else{
            this.productsResponse = {
              ...data,
              content:[...this.productsResponse!.content,...data.content]
            }
            console.log("StoreComponent loadLiveProducts in else: ",this.productsResponse);
          }
        }
    });
  }

  onScroll(event:IInfiniteScrollEvent){
         console.log("scrolling logged",event);
         if(this.loading || this.productsResponse?.lastPage){
             return;
         }
        //  // load the data of other pages
         this.pageNumber += 1; 
         this.loadCategoryProducts(this.categoryId!,this.pageNumber);
     }
}
