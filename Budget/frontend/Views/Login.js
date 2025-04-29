import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator,Button } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api'; 

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, userId } = response.data;

      // Save token and userId for future use
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', userId);

      Alert.alert('Welcome back!');
      navigation.navigate('Home'); 
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert('Login Failed', err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} placeholder="Email" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading} 
        >
          <Text style={styles.loginText}>
            {loading ? 'Fetching your piggy bank...' : 'Log in'}
          </Text>
        </TouchableOpacity>
        <Button 
          onPress={() => navigation.navigate('SignUp')}
          title="Create an Account"
          />
        {loading && (
          <ActivityIndicator size="small" color="#000" style={{ marginTop: 10 }} />
        )}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 24,
  },
  loginContainer: {
    backgroundColor: '#c8d9e6',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
    borderColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 20,
  },
  input: {
    padding: 10,
    height: 48,
    width: 320,
    backgroundColor: 'white',
    margin: 16,
  },
});
