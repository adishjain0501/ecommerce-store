import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-single-product-card',
  standalone: true,
  imports: [NgClass,CurrencyPipe,NgIf,RouterLink],
  templateUrl: './single-product-card.component.html',
  styleUrl: './single-product-card.component.scss'
})
export class SingleProductCardComponent {
    constructor(public productService:ProductService){}

    @Input() product?: Product;
}
