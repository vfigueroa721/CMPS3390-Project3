import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated, Easing, Image } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [message, setMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });

  const motivationalQuotes = [
    "Keep going, you're doing amazing!",
    "Save today, enjoy tomorrow!",
    "Small steps make big changes!",
    "Every penny counts!",
    "Your future self will thank you!",
    "Dream big, save bigger!",
    "Invest in your future, one dollar at a time.",
    "The best time to save was yesterday. The second best time is now.",
    "Your savings today secure your freedom tomorrow.",
    "Don't just save money, make your money work for you.",
    "A little progress each day adds up to big results.",
    "The key to financial freedom is making saving a habit.",
    "Your financial future is built by the choices you make today.",
    "Save a little, spend wisely, and your future will be secure.",
    "A penny saved is a penny earned, and every penny counts!",
    "The more you save, the more you grow."
  ];

  const generateMessage = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setMessage(motivationalQuotes[randomIndex]);
  };

  const startBouncing = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userEmail');
    navigation.replace('Login'); 
  };

  const fetchUserData = async () => {
    const name = await AsyncStorage.getItem('userName');
    const email = await AsyncStorage.getItem('userEmail');
    setUserInfo({ name: name || 'Name', email: email || 'Email' });
  };

  useEffect(() => {
    startBouncing();
    generateMessage();
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PiggyPocket</Text>

      {}
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => setShowProfile(!showProfile)}>
          <Image
            source={require('../../assets/profile-icon.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
        {showProfile && (
          <View style={styles.profileDropdown}>
            <Text style={styles.profileText}>Name: {userInfo.name}</Text>
            <Text style={styles.profileText}>Email: {userInfo.email}</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Animated.Image
        source={require('../../assets/piggy.png')}
        style={[
          styles.piggyImage,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />

      <Text style={styles.welcome}>Welcome back!</Text>
      <Text style={styles.motivation}>{message}</Text>

      <TouchableOpacity onPress={generateMessage} style={styles.newMessageButton}>
        <Text style={styles.buttonText}>Get New Motivation</Text>
      </TouchableOpacity>


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
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#c71585',
    marginBottom: 20,
    textAlign: 'center',
  },
  piggyImage: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  motivation: {
    fontSize: 16,
    color: '#7a7a7a',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  newMessageButton: {
    backgroundColor: '#ff69b4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#c1121f',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  profileContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  profileIcon: {
    width: 40,
    height: 40,
  },
  profileDropdown: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'flex-start',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  profileText: {
    fontSize: 14,
    marginBottom: 4,
  },
});