import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { getAllProducts } from "../../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem, Product } from "../../models/product";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

const ProductListScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const addToCart = async (product: Product) => {
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

  const addToFavorite = async (product: Product) => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      console.log(favorites);
      if (!favorites) {
        await AsyncStorage.setItem("favorites", JSON.stringify([product]));
        alert("Product added to favorites!");
        return;
      }
      const favoriteItems: Product[] = favorites ? JSON.parse(favorites) : [];
      console.log(favoriteItems);
      const existingItem = favoriteItems.find((item) => item.id === product.id);

      if (existingItem) {
        alert("Product already in favorites!");
        return;
      } else {
        favoriteItems.push(product);
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(favoriteItems));
      alert("Product added to favorites!");
    } catch (err) {
      console.error("Error adding to favorites:", err);
    }
  };

  const handleLogout = () => {
    // Clear any stored user data (e.g., token) if needed
    router.push("/login");
  };
  const handleFavorite = () => {
    router.push("/favorite");
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Animatable.View animation="fadeInUp" duration={800}>
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(event) => {
            event.stopPropagation(); // Prevents parent onPress from triggering
            addToFavorite(item);
          }}
        >
          <AntDesign name="hearto" size={20} color="#fff" />
        </TouchableOpacity>

        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Text style={styles.productName} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(item)}
        >
          <LinearGradient
            colors={["#007bff", "#0056b3"]}
            style={styles.addButtonGradient}
          >
            <Ionicons
              name="cart-outline"
              size={16}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderCategory = ({ item }: { item: { id: number; name: string } }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const { width } = Dimensions.get("window");
  const numColumns = 2;

  if (loading)
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  if (error) return <Text style={styles.error}>{error}</Text>;

  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Shoes" },
    { id: 4, name: "Watches" },
    { id: 5, name: "Home" },
    { id: 6, name: "Beauty" },
    { id: 7, name: "Sports" },
    { id: 8, name: "Books" },
    { id: 9, name: "Toys" },
    { id: 10, name: "Food" },
  ];

  const CategorySection = () => {
    return (
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ecommerce App</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFavorite}>
          <Ionicons name="heart" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <CategorySection />
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => router.push("/cart")}
      >
        <LinearGradient
          colors={["#28a745", "#218838"]}
          style={styles.cartButtonGradient}
        >
          <Ionicons
            name="cart-outline"
            size={20}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.cartButtonText}>Go to Cart</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingTop: 40 },
  list: { paddingHorizontal: 10, paddingBottom: 20 },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: Dimensions.get("window").width / 2 - 20,
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
    backgroundColor: "rgba(239, 46, 46, 0.62)",
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    borderRadius: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginVertical: 5,
    textAlign: "center",
  },
  productPrice: { fontSize: 14, color: "#888", marginBottom: 10 },
  addButton: { width: "100%", borderRadius: 10, overflow: "hidden" },
  addButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  buttonIcon: { marginRight: 8 },
  addButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#333" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: { marginRight: 10 },
  searchBar: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  cartButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  cartButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  cartButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  categoryContainer: { marginVertical: 10 },
  categoryList: { paddingHorizontal: 10 },
  categoryItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  categoryText: { color: "#333", fontWeight: "600" },
});

export default ProductListScreen;
