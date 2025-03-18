import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { useRouter } from "expo-router";
import { CartItem } from "../models/product";

const FavoriteScreen = () => {
  const [favoriteItems, setFavoriteItems] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      setFavoriteItems(favorites ? JSON.parse(favorites) : []);
    } catch (err) {
      console.error("Error loading favorites:", err);
    }
  };

  const removeFavorite = async (item: CartItem) => {
    const updatedFavorites = favoriteItems.filter(
      (favItem) => favItem.id !== item.id
    );
    setFavoriteItems(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const renderFavoriteItem = ({ item }: { item: CartItem }) => (
    <Animatable.View animation="fadeInUp" duration={800}>
      <View style={styles.favoriteItem}>
        <Text style={styles.favoriteItemName}>{item.title}</Text>
        <Text style={styles.favoriteItemPrice}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() =>
            Alert.alert(
              "Remove Favorite?",
              "Are you sure you want to remove this item from favorites?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Remove",
                  style: "destructive",
                  onPress: () => removeFavorite(item),
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
              name="heart-dislike-outline"
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
        data={favoriteItems}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your favorites list is empty.</Text>
        }
        contentContainerStyle={styles.list}
      />
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
  favoriteItem: {
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
  favoriteItemName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  favoriteItemPrice: { fontSize: 14, color: "#888", marginVertical: 5 },
  removeButton: { borderRadius: 10, overflow: "hidden" },
  removeButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonIcon: { marginRight: 8 },
  removeButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default FavoriteScreen;