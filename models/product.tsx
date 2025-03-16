// models/product.tsx
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}
