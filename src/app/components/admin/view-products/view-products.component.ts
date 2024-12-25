import { Component, OnInit, TemplateRef } from '@angular/core';
import { Product, ProductsResponse } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [NgFor,NgIf,NgClass,NgbPagination],
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.scss'
})
export class ViewProductsComponent implements OnInit{
    product!: Product;
    productsResponse?:ProductsResponse
    constructor(public productService:ProductService,
      private toastrService:ToastrService,private modalService:NgbModal){}

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
        this.modalService.open(content, { 
          ariaLabelledBy: 'modal-basic-title',
          size: 'xl'
        });
        this.product = product;
        // .result.then(
        //   (result) => {
        //     this.closeResult.set(`Closed with: ${result}`);
        //   },
        //   (reason) => {
        //     this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
        //   },
        // );
      }

      pageChange(page: number) {
          console.log(page);
          this.loadProducts(page-1);
      }

}
