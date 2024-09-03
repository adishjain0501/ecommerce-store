import { Component, Input } from '@angular/core';
import { Category } from '../../../models/category.model';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-single-category-view',
  standalone: true,
  imports: [SlicePipe],
  templateUrl: './single-category-view.component.html',
  styleUrl: './single-category-view.component.scss'
})
export class SingleCategoryViewComponent {
  @Input() category?:Category
}
