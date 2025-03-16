// app/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://fakestoreapi.com/auth/login', {
        username,
        password,
      });
      if (response.data.token) {
        Alert.alert('Success', 'Login successful!');
        router.push('/(drawer)/(tabs)');
      }
    } catch (err) {
      Alert.alert('Error', 'Invalid credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 5, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  loginButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 5 },
  loginButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});

export default LoginScreen;