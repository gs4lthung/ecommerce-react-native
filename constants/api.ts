// constants/api.tsx
import { Product } from '@/models/product';
import axios from 'axios';

const API_URL = 'https://fakestoreapi.com';

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch product');
  }
};