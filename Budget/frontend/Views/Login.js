import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, ImageBackground,KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.33:5000/api'; 

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

  const bypassLogin = async() => {
    try {
      await AsyncStorage.setItem('token', 'temporaryToken');
      await AsyncStorage.setItem('userId', '12345');
      Alert.alert('Bypassed login');
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Error', 'Failed to save fake login');
      console.error(err);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background.jpg')}
      style={styles.image}
    >
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >


      <View style={styles.container}>
        <Svg 
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={styles.svg}>
          <Path 
            fill="#f3f4f5" 
            d="M0,32L34.3,26.7C68.6,21,137,11,206,53.3C274.3,96,343,192,411,213.3C480,235,549,181,617,176C685.7,171,754,213,823,229.3C891.4,245,960,235,1029,229.3C1097.1,224,1166,224,1234,197.3C1302.9,171,1371,117,1406,90.7L1440,64L1440,320L0,320Z"
          />
        </Svg>

        <View style={styles.loginContainer}>
          <Text style={styles.title}>Login</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              {loading ? 'Fetching your piggy bank...' : 'Log in'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, {backgroundColor: 'white'}]}
            onPress={bypassLogin} 
            >
            <Text style={styles.loginText}>Bypass</Text>
            </TouchableOpacity>
          <Text style={styles.createAccountText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.createAccountButton}>Create an Account</Text>
          </TouchableOpacity>

          {loading && (
            <ActivityIndicator size="small" color="#000" style={{ marginTop: 10 }} />
          )}
        </View>  

        <StatusBar style="auto" />
      </View>
      </KeyboardAvoidingView>
     </TouchableWithoutFeedback>
     </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 24,
    color: 'rgba(44, 111, 160, 0.95)',
  },
  image: {
    resizeMode: 'cover',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  loginContainer: {
    marginTop: 450,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
    borderColor: 'black',
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(64, 131, 180, 0.68)',
  },
  loginText: {
    fontSize: 17,
  },
  input: {
    padding: 10,
    height: 48,
    width: 320,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(64, 131, 180, 0.68)',
  },
  svg: {
    position: 'absolute',
    bottom: 0,
    width: '700%',
    height: '115%',
    zIndex: 0,
  },
  createAccountText: {
    marginTop: 10,
  },
  createAccountButton: {
    color: 'blue',
    fontSize: 15,
  },
});
