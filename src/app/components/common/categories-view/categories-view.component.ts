import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Store } from '@ngrx/store';
import { Category } from '../../../models/category.model';
import { take } from 'rxjs';
import { setCategoryData } from '../../../store/category/category.actions';
import { NgFor } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-categories-view',
  standalone: true,
  imports: [NgFor,RouterLink,RouterLinkActive],
  templateUrl: './categories-view.component.html',
  styleUrl: './categories-view.component.scss'
})
export class CategoriesViewComponent implements OnInit{
  categories:Category[] = [];
  constructor(private catService:CategoryService,private categoryStore:Store<{cat:Category[]}>){}

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

}
