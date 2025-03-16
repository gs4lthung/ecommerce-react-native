// app/product/[id].tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '../../models/product';
import { getProductById } from '../../constants/api';

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = React.useState<Product | null>(null);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!product) return;
    try {
      const cart = await AsyncStorage.getItem('cart');
      const cartItems: CartItem[] = cart ? JSON.parse(cart) : [];
      const existingItem = cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1;
      } else {
        cartItems.push({ ...product, quantity: 1 });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  if (!product) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.title}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <TouchableOpacity style={styles.addButton} onPress={addToCart}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  productImage: { width: '100%', height: 300, resizeMode: 'contain' },
  productName: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  productPrice: { fontSize: 18, color: '#888', marginBottom: 10 },
  productDescription: { fontSize: 14, color: '#666', marginBottom: 20 },
  addButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 5 },
  addButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});

export default ProductDetailScreen;