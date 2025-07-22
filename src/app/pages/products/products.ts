import { Component } from '@angular/core';
import { Product } from '../../services/products';
import { Products } from '../../services/products';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsPage {

  products : Product[] = [];
  constructor(private product:Products){
    this.products = this.product.getProducts();
  }
}
