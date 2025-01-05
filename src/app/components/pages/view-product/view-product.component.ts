import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss'
})
export class ViewProductComponent {
    productId?:string;
    product?:Product;
    constructor(private activatedRoute:ActivatedRoute,private productService:ProductService){
        this.activatedRoute.params.subscribe(param=>{
            this.productId = param['productId'];
            console.log("ViewProductComponent constructor: ",this.productId);
            this.loadProduct();
        })
    }
  loadProduct() {
      if(this.productId){
          this.productService.getProduct(this.productId).subscribe({
              next: data=>{
                  console.log(data);
                  this.product = data;
              }
          })
      }
      
  }
}
