// app/(drawer)/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllProducts } from '../../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '../../../models/product';

const ProductListScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const { width } = Dimensions.get('window');
  const numColumns = width > 600 ? 3 : 2;

  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
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
        onPress={() => router.push('/cart')}
      >
        <Text style={styles.cartButtonText}>Go to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  searchBar: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  list: { paddingBottom: 20 },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  productImage: { width: '100%', height: 150, resizeMode: 'contain' },
  productName: { fontSize: 14, fontWeight: 'bold', marginVertical: 5, textAlign: 'center' },
  productPrice: { fontSize: 14, color: '#888' },
  addButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 10 },
  addButtonText: { color: '#fff', textAlign: 'center' },
  cartButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, margin: 10 },
  cartButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ProductListScreen;