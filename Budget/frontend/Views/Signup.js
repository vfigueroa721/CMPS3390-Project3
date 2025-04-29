import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';

export default function SignUp({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Home');
    }, 1000); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.signUpContainer}>
        <Text style={styles.title}>Create an Account</Text>
        <TextInput style={styles.input} placeholder="Email" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry />

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
          disabled={loading} 
        >
          <Text style={styles.signUpText}>
            {loading ? 'Creating your piggy bank...' : 'create account'}
          </Text>
        </TouchableOpacity>

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
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 24,
  },
  signUpContainer: {
    backgroundColor: '#c8d9e6',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  signUpButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
    borderColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  signUpText: {
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
