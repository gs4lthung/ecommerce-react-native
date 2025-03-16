// app/cart.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../models/product';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      setCartItems(cart ? JSON.parse(cart) : []);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  const updateQuantity = async (item: CartItem, delta: number) => {
    const updatedCart = cartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        const newQuantity = cartItem.quantity + delta;
        return { ...cartItem, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return cartItem;
    });
    setCartItems(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = async (item: CartItem) => {
    const updatedCart = cartItems.filter((cartItem) => cartItem.id !== item.id);
    setCartItems(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Text style={styles.cartItemName}>{item.title}</Text>
      <Text style={styles.cartItemPrice}>${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => updateQuantity(item, -1)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item, 1)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(item)}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
      />
      <Text style={styles.totalText}>Total: ${getTotalPrice()}</Text>
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => router.push({ pathname: '/checkout', params: { cartItems: JSON.stringify(cartItems) } })}
        disabled={cartItems.length === 0}
      >
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  cartItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10 },
  cartItemName: { fontSize: 16, fontWeight: 'bold' },
  cartItemPrice: { fontSize: 14, color: '#888', marginVertical: 5 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  quantityButton: { fontSize: 20, paddingHorizontal: 10 },
  quantityText: { fontSize: 16, marginHorizontal: 10 },
  removeButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5 },
  removeButtonText: { color: '#fff', textAlign: 'center' },
  totalText: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginVertical: 10 },
  checkoutButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 5 },
  checkoutButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
});

export default CartScreen;