import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { signupUser } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !email || !password) {
      Alert.alert('Please fill out all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await signupUser(firstName, email, password);
      console.log('Signup response:', data);

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('userId', data.userId);
      Alert.alert('Signup successful');
      navigation.navigate('Home'); // Or 'Login' depending on your flow
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert('Signup failed', error.response?.data?.error || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.signUpContainer}>
        <Text style={styles.title}>Create an Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={firstName}
          onChangeText={setFirstName}
        />
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
          style={styles.signUpButton}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.signUpText}>
            {loading ? 'Creating your piggy bank...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="small" color="#000" style={{ marginTop: 10 }} />}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  title: {
    textAlign: 'center', fontSize: 30, fontWeight: 'bold', marginTop: 24, marginBottom: 24,
  },
  signUpContainer: {
    backgroundColor: '#c8d9e6', borderRadius: 10, alignItems: 'center',
    paddingVertical: 20, paddingHorizontal: 10,
  },
  signUpButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)', borderColor: 'black',
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10,
    width: '100%', marginBottom: 20, alignItems: 'center',
  },
  signUpText: { fontSize: 20 },
  input: {
    padding: 10, height: 48, width: 320, backgroundColor: 'white', margin: 16,
  },
});
