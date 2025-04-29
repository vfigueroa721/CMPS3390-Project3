import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const piggyX = useRef(new Animated.Value(0)).current;
  const piggyY = useRef(new Animated.Value(0)).current;
  const [message, setMessage] = useState('');

  const motivationalQuotes = [
    "Keep going, you're doing amazing!",
    "Save today, enjoy tomorrow!",
    "Small steps make big changes!",
    "Every penny counts!",
    "Your future self will thank you!",
    "Dream big, save bigger!"
  ];

  const generateMessage = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setMessage(motivationalQuotes[randomIndex]);
  };

  const movePiggy = () => {
    // Animate the piggy to a random position
    Animated.parallel([
      Animated.timing(piggyX, {
        toValue: Math.random() * (width - 160), // Random X position
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(piggyY, {
        toValue: Math.random() * (height - 300), // Random Y position
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PiggyPocket</Text>

      <Animated.Image
        source={require('../../assets/piggy.png')}
        style={[
          styles.piggyImage,
          {
            transform: [
              { translateX: piggyX },
              { translateY: piggyY },
            ],
          },
        ]}
        // Trigger movePiggy when the piggy is pressed
        onPress={movePiggy}
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
    backgroundColor: '#ffc0cb',
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
    position: 'absolute',
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
});

