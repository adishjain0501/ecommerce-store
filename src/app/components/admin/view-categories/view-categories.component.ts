import { NgFor, SlicePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SingleCategoryViewComponent } from "../../common/single-category-view/single-category-view.component";
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-view-categories',
  standalone: true,
  imports: [NgFor, SingleCategoryViewComponent],
  templateUrl: './view-categories.component.html',
  styleUrl: './view-categories.component.scss'
})
export class ViewCategoriesComponent implements OnInit{
  categories:Category[] = [];
  constructor(private categoryService:CategoryService){}
  ngOnInit(): void {
      this.categoryService.getCategories().subscribe({
        next:(resp)=>{
            console.log("getCategory response: ",resp);
            this.categories = resp.content;
        }
      })
  }
    // categories = [
    //   {
    //     categoryId:'',
    //     title:'Clothing',
    //     description:'This is clothing category',
    //     coverImage: 'https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg'
    //   },
    //   {
    //     categoryId:'',
    //     title:'Sports',
    //     description:'This is Sports category',
    //     coverImage: 'https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg'
    //   },
    //   {
    //     categoryId:'',
    //     title:'Books',
    //     description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //     coverImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    //   },
    //   {
    //     categoryId:'',
    //     title:'Books',
    //     description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //     coverImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    //   }
    // ]


}
