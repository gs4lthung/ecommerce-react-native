// app/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://fakestoreapi.com/auth/login", {
        username,
        password,
      });
      if (response.data.token) {
        Alert.alert("Success", "Login successful!");
        router.push("/(drawer)/(tabs)");
      }
    } catch (err) {
      Alert.alert("Error", "Invalid credentials.");
    }
  };

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.container}
    >
      <Animatable.View animation="fadeInDown" style={styles.formContainer}>
        <Text style={styles.header}>Welcome Back</Text>
        <Text style={styles.subHeader}>Sign in to continue shopping</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <Animatable.View animation="pulse">
          <TouchableOpacity onPress={handleLogin}>
            <LinearGradient
              colors={["#007bff", "#0056b3"]}
              style={styles.loginButton}
            >
              <Ionicons
                name="log-in-outline"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.loginButtonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
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
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
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
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonIcon: { marginRight: 10 },
  loginButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default LoginScreen;
