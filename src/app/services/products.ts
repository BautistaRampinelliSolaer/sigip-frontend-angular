import { Injectable } from '@angular/core';

export interface Product{
  id: number;
  name: string;
  description: string;
  price: number;
  img: string;
}

@Injectable({
  providedIn: 'root'
})

export class Products {
  constructor() { };
  private products:Product[] = [];

  getProducts():Product[]{
    return this.products;
  }
}
