import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './frontend/Views/Login';
import NavBar from './frontend/Navigation/Navbar';
import SignUp from './frontend/Views/Signup';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name='Home' component={NavBar} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name='SignUp' component={SignUp} options={{headerShown:false}}></Stack.Screen>
      </Stack.Navigator>
      <StatusBar style='auto'></StatusBar>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
