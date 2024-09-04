import { HttpClient } from "@angular/common/http";
import { Category, CategoryPaginatedResponse } from "../models/category.model";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class CategoryService{
    constructor(private http:HttpClient){  }

    createCategory(category:Category){
        return this.http.post<Category>(`${environment.baseUrl}/categories`,category);
    }

    getCategories(){
        return this.http.get<CategoryPaginatedResponse>(`${environment.baseUrl}/categories?pageSize=${environment.MAX_PAGE_SIZE}`);
    }
}