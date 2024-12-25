import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Product, ProductsResponse } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  createProductWithCategory(product:Product){
      return this.http.post<Product>(`${environment.baseUrl}/categories/${product.category.categoryId}/products`,product);
  }

  createProduct(product:Product){
      return this.http.post(`${environment.baseUrl}/products`,product);
  }

  uploadProductImage(productId:string,imageData:File){
      const formData = new FormData();
      formData.append('productImage',imageData);
      return this.http.post(`${environment.baseUrl}/products/image/${productId}`,formData);
  }

  getLiveProducts(pageNumber=0,pageSize=10,sortBy='title',sortDir='asc'){
      return this.http.get<ProductsResponse>(`${environment.baseUrl}/products/live?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  getAllProducts(pageNumber=0,pageSize=10,sortBy='title',sortDir='asc'){
    return this.http.get<ProductsResponse>(`${environment.baseUrl}/products?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  getProductImageUrl(productId:string){
      return `${environment.baseUrl}/products/image/${productId}`;
  }
}
