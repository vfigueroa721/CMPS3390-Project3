import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../Views/Home';
import Goals from '../Views/Goals';
import Balance from '../Views/Balance';
import Calendar from '../Views/Calendar';

const Tab = createBottomTabNavigator();

export default function Navbar() {
    return (
    <Tab.Navigator 
    screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: styles.header,
        tabBarStyle: styles.tabBar,
        tabBarIcon : ({ focused, color, size}) => {
            // icons for navbar 
            let iconName;
            if(route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
            } else if(route.name === 'Goals') {
                iconName = focused ? 'trophy' : 'trophy-outline';
            } else if(route.name === 'Balance') {
                iconName = focused ? 'cash' : 'cash-outline';
            } else if(route.name === 'Calendar') {
                iconName = focused ? 'calendar' : 'calendar-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />; 
        },
    })}
    
    >
        {/* navbar links*/}
        <Tab.Screen name='Home' component={Home}></Tab.Screen>
        <Tab.Screen name='Goals' component={Goals} ></Tab.Screen>
        <Tab.Screen name='Calendar' component={Calendar} ></Tab.Screen>
        <Tab.Screen name='Balance' component={Balance} ></Tab.Screen>
    </Tab.Navigator>
    );
}

// styles 
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#c8d9e5',
    },
    tabBar: {
      tabBarActiveTintColor: '#1F7587',
      tabBarInactiveTintColor: 'black',
      backgroundColor: '#c8d9e6',
    },
});
  