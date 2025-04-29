import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Button, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import Login from './Login';
import Svg, { Path } from 'react-native-svg';

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
    <ImageBackground
     source={require('../../assets/background.jpg')}
     style={styles.image}
    >
    <View style={styles.container}>
        <Svg 
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={styles.svg}>
             <Path 
            fill="#f3f4f5" 
            fillOpacity="1" 
            d="M0,32L34.3,26.7C68.6,21,137,11,206,53.3C274.3,96,343,192,411,213.3C480,235,549,181,617,176C685.7,171,754,213,823,229.3C891.4,245,960,235,1029,229.3C1097.1,224,1166,224,1234,197.3C1302.9,171,1371,117,1406,90.7L1440,64L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
            />
        </Svg>
        
      <View style={styles.signUpContainer}>
        <Text style={styles.title}>Create account</Text>
        <TextInput style={styles.input} placeholder='Name' />
        <TextInput style={styles.input} placeholder="Email" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry />

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
          disabled={loading} 
        >
          <Text style={styles.signUpText}>
            {loading ? 'Creating your piggy bank...' : 'Create account'}
          </Text>
        </TouchableOpacity>
        <Text>Already have an account?</Text>
        <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
        >
            <Text style={styles.loginButton}>Login</Text>
        </TouchableOpacity>
        
        {loading && (
          <ActivityIndicator size="small" color="#000" style={{ marginTop: 10 }} />
        )}
      </View>
      <StatusBar style="auto" />
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 24,
    color: 'rgba(44, 111, 160, 0.95)',
  },
  signUpContainer: {
    marginTop: 450,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  signUpButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
    paddingVertical: 4,
    paddingHorizontal: 18,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(64, 131, 180, 0.68)',
  },
  signUpText: {
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
    height: '132%',
    zIndex: 0,
    borderWidth: 0,
    borderColor: 'rgba(64, 131, 180, 0.68)',
  },
  loginButton: {
    color: 'blue',
    fontSize: 15,
  },
});
