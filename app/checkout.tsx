// app/checkout.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem } from "../models/product";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const CheckoutScreen = () => {
  const { cartItems: cartItemsString } = useLocalSearchParams();
  const cartItems: CartItem[] = cartItemsString
    ? JSON.parse(cartItemsString as string)
    : [];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleCheckout = async () => {
    if (!name || !email || !address) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    const orderDetails = {
      name,
      email,
      address,
      cartItems,
      total: cartItems
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2),
    };

    Alert.alert(
      "Order Placed Successfully!",
      `Order Details:\n\nName: ${name}\nEmail: ${email}\nAddress: ${address}\n\nProducts:\n${orderDetails.cartItems
        .map(
          (item) =>
            `• ${item.title} (x${item.quantity}) - $${
              item.price * item.quantity
            }`
        )
        .join("\n")}\n\nTotal: $${orderDetails.total}`
    );

    // Clear the cart after checkout
    await AsyncStorage.setItem("cart", JSON.stringify([]));
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.formContainer}>
        <Text style={styles.header}>Checkout</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="location-outline"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#666"
            value={address}
            onChangeText={setAddress}
          />
        </View>
        <Animatable.View animation="pulse">
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCheckout}
          >
            <LinearGradient
              colors={["#28a745", "#218838"]}
              style={styles.submitButtonGradient}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.submitButtonText}>Place Order</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    marginTop: 30,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
  },
  submitButton: { borderRadius: 15, overflow: "hidden", marginTop: 20 },
  submitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  buttonIcon: { marginRight: 10 },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default CheckoutScreen;
