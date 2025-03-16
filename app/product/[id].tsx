// app/product/[id].tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem, Product } from "../../models/product";
import { getProductById } from "../../constants/api";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = React.useState<Product | null>(null);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!product) return;
    try {
      const cart = await AsyncStorage.getItem("cart");
      const cartItems: CartItem[] = cart ? JSON.parse(cart) : [];
      const existingItem = cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1;
      } else {
        cartItems.push({ ...product, quantity: 1 });
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cartItems));
      alert("Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  if (!product) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="zoomIn" duration={800}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
      </Animatable.View>
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={styles.detailsContainer}
      >
        <Text style={styles.productName}>{product.title}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <TouchableOpacity style={styles.addButton} onPress={addToCart}>
          <LinearGradient
            colors={["#007bff", "#0056b3"]}
            style={styles.addButtonGradient}
          >
            <Ionicons
              name="cart-outline"
              size={20}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  productImage: {
    width: "100%",
    height: 350,
    resizeMode: "contain",
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 20,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    color: "#007bff",
    fontWeight: "600",
    marginBottom: 15,
  },
  productDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },
  addButton: { borderRadius: 15, overflow: "hidden" },
  addButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  buttonIcon: { marginRight: 10 },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  loading: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#666" },
});

export default ProductDetailScreen;
