import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  Image,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const ConfettiCannon = Platform.OS !== 'web' ? require('react-native-confetti-cannon').default : () => null;

const { width, height } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [message, setMessage] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [showConfetti, setShowConfetti] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [dailyBonusShown, setDailyBonusShown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const progress = 65;

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

  const financialTips = [
    "Automate your savings every month.",
    "Cut back on small daily expenses.",
    "Use a budget tracking app (like this one!).",
    "Review your subscriptions regularly.",
    "Set SMART financial goals."
  ];

  const getTimeOfDayColors = () => {
    const hour = new Date().getHours();
    if (hour < 12) return ['#ffecd2', '#fcb69f'];
    if (hour < 18) return ['#ffdde1', '#ee9ca7'];
    return ['#d299c2', '#fef9d7'];
  };

  const generateMessage = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const quote = motivationalQuotes[randomIndex];
    setMessage(quote);
    setDisplayedText('');
    animateText(quote);
    setShowConfetti(true);
  };

  const animateText = (text) => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => text.slice(0, i++));
      if (i > text.length) clearInterval(interval);
    }, 40);
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

  const fetchUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      const email = await AsyncStorage.getItem('userEmail');
      setUserInfo({
        name: name || 'Name',
        email: email || 'Email',
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const checkDailyBonus = async () => {
    const today = new Date().toDateString();
    const lastBonus = await AsyncStorage.getItem('lastBonusDate');
    if (lastBonus !== today) {
      await AsyncStorage.setItem('lastBonusDate', today);
      setDailyBonusShown(true);
      setTimeout(() => setDailyBonusShown(false), 5000);
    }
  };

  const handlePiggyPress = async () => {
    generateMessage();
    setTapCount((prev) => {
      const newCount = prev + 1;
      AsyncStorage.setItem('tapScore', newCount.toString());
      return newCount;
    });
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'userId', 'userName', 'userEmail']);
    navigation.replace('Login');
  };

  useEffect(() => {
    startBouncing();
    generateMessage();
    fetchUserData();
    checkDailyBonus();
  }, []);

  return (
    <LinearGradient colors={getTimeOfDayColors()} style={styles.container}>
      <Text style={styles.title}>PiggyPocket</Text>

      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => setShowProfile(!showProfile)}>
          <Image
            source={require('../../assets/profile-icon.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
        {showProfile && (
          <View style={styles.profileDropdown}>
            <Text style={styles.profileText}>Email: {userInfo.email}</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={handlePiggyPress}>
        <Animated.Image
          source={require('../../assets/piggy.png')}
          style={[styles.piggyImage, { transform: [{ scale: scaleAnim }] }]}
        />
      </TouchableOpacity>

      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>"Keep saving, champ!"</Text>
      </View>

      <Text style={styles.welcome}>
        Welcome back{userInfo.name ? `, ${userInfo.name.split(' ')[0]}!` : '!'}
      </Text>

      <Text style={styles.motivation}>{displayedText}</Text>

      <Text style={styles.tip}>💡 Tip: {financialTips[Math.floor(Math.random() * financialTips.length)]}</Text>

      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Monthly Goal Progress</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}% saved</Text>
      </View>

      <Text style={styles.tapCounter}>🐷 Taps: {tapCount}</Text>

      {dailyBonusShown && (
        <View style={styles.bonusBox}>
          <Text style={styles.bonusText}>🎁 Daily Bonus: +10 Savings Points!</Text>
        </View>
      )}

      {showConfetti && Platform.OS !== 'web' && (
        <ConfettiCannon
          count={25}
          origin={{ x: width / 2, y: height / 2 }}
          fadeOut
          fallSpeed={3000}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}

      <StatusBar style="auto" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  bubble: {
    backgroundColor: '#fff0f5',
    padding: 8,
    borderRadius: 12,
    marginBottom: 10,
  },
  bubbleText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#8b008b',
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  motivation: {
    fontSize: 16,
    color: '#7a7a7a',
    marginVertical: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  tip: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#444',
    marginBottom: 15,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  progressLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressBarBackground: {
    width: '80%',
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#32cd32',
  },
  progressText: {
    marginTop: 4,
    fontSize: 12,
  },
  tapCounter: {
    fontSize: 16,
    marginTop: 10,
  },
  bonusBox: {
    marginTop: 15,
    backgroundColor: '#fffacd',
    padding: 10,
    borderRadius: 10,
  },
  bonusText: {
    fontWeight: 'bold',
    color: '#d2691e',
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
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#c1121f',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});