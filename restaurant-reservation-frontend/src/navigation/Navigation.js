import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ReservationScreen from '../screens/ReservationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminScreen from '../screens/AdminScreen';

const Stack = createNativeStackNavigator();
// navigation function
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ marginRight: 15 }}>
                <Text>Προφίλ</Text>
              </TouchableOpacity>
            ),
            title: 'Αρχική',
          })}
        />
        <Stack.Screen name="Reservation" component={ReservationScreen} options={{ title: 'Κράτηση' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Το Προφίλ μου' }} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} options={{ title: 'Διαχείριση Μαγαζιών' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}