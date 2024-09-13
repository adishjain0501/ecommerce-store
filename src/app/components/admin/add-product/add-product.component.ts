import { Component, OnInit } from '@angular/core';
import { IconsModule } from '../../../helper/icons/icons.module';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { JsonPipe, NgFor } from '@angular/common';
import { Store } from '@ngrx/store';
import { setCategoryData } from '../../../store/category/category.actions';
import { Product } from '../../../models/product.model';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [IconsModule,NgFor,FormsModule,JsonPipe],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit{

  categories:Category[]=[];
  product = new Product();
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

  compareFn (optionValue: any,modelValue: any):boolean  {
      return optionValue && modelValue ? optionValue.categoryId === modelValue.categoryId : optionValue === modelValue;
    }



}
