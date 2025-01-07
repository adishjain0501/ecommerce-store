import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../../models/cart.model';
import { CurrencyPipe, NgIf } from '@angular/common';
import { IconsModule } from '../../../helper/icons/icons.module';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [NgIf,CurrencyPipe,IconsModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input() cartItem?:CartItem;
  @Output() itemIncreaseQuantityEvent = new EventEmitter<CartItem>();
  @Output() itemDecreaseQuantityEvent = new EventEmitter<CartItem>();
  @Output() itemDeleteEvent = new EventEmitter<CartItem>();
  constructor(public productService:ProductService){}

  increaseQuantity(cartItem:CartItem){
      this.itemIncreaseQuantityEvent.next(cartItem);
  }

  decreaseQuantity(cartItem:CartItem){
    this.itemDecreaseQuantityEvent.next(cartItem);
  }

  deleteItem(cartItem:CartItem){
    this.itemDeleteEvent.next(cartItem);
  }
}
