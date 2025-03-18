// app/cart.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem } from "../models/product";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cart = await AsyncStorage.getItem("cart");
      setCartItems(cart ? JSON.parse(cart) : []);
    } catch (err) {
      console.error("Error loading cart:", err);
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
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = async (item: CartItem) => {
    const updatedCart = cartItems.filter((cartItem) => cartItem.id !== item.id);
    setCartItems(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <Animatable.View animation="fadeInUp" duration={800}>
      <View style={styles.cartItem}>
        <Text style={styles.cartItemName}>{item.title}</Text>
        <Text style={styles.cartItemPrice}>
          ${item.price} x {item.quantity} = $
          {(item.price * item.quantity).toFixed(2)}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item, -1)}>
            <LinearGradient
              colors={["#ff6b6b", "#ee5253"]}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item, 1)}>
            <LinearGradient
              colors={["#28a745", "#218838"]}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() =>
            Alert.alert(
              "Are your sure?",
              "Do you want to remove this item from your cart?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Remove",
                  style: "destructive",
                  onPress: () => removeItem(item),
                },
              ]
            )
          }
        >
          <LinearGradient
            colors={["#dc3545", "#bd2130"]}
            style={styles.removeButtonGradient}
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.removeButtonText}>Remove</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        }
        contentContainerStyle={styles.list}
      />
      <Animatable.View animation="fadeInUp" duration={1000}>
        <Text style={styles.totalText}>Total: ${getTotalPrice()}</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() =>
            router.push({
              pathname: "/checkout",
              params: { cartItems: JSON.stringify(cartItems) },
            })
          }
          disabled={cartItems.length === 0}
        >
          <LinearGradient
            colors={["#28a745", "#218838"]}
            style={styles.checkoutButtonGradient}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 20,
    marginTop: 30,
  },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  cartItem: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cartItemName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  cartItemPrice: { fontSize: 14, color: "#888", marginVertical: 5 },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  quantityButton: {
    borderRadius: 20,
    padding: 10,
    width: 40,
    alignItems: "center",
  },
  quantityButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  quantityText: { fontSize: 16, color: "#333", marginHorizontal: 15 },
  removeButton: { borderRadius: 10, overflow: "hidden" },
  removeButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonIcon: { marginRight: 8 },
  removeButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  checkoutButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  checkoutButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  checkoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default CartScreen;
