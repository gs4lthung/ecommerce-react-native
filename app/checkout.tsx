// app/checkout.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../models/product';

const CheckoutScreen = () => {
  const { cartItems: cartItemsString } = useLocalSearchParams();
  const cartItems: CartItem[] = cartItemsString ? JSON.parse(cartItemsString as string) : [];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleCheckout = async () => {
    if (!name || !email || !address) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    const orderDetails = {
      name,
      email,
      address,
      cartItems,
      total: cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2),
    };

    Alert.alert(
      'Order Placed Successfully!',
      `Order Details:\nName: ${name}\nEmail: ${email}\nAddress: ${address}\nTotal: $${orderDetails.total}`
    );

    // Clear the cart after checkout
    await AsyncStorage.setItem('cart', JSON.stringify([]));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleCheckout}>
        <Text style={styles.submitButtonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 5, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  submitButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, marginTop: 20 },
  submitButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});

export default CheckoutScreen;