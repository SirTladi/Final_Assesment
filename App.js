import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './AuthScreen';
import HomeScreen from './HomeScreen';
import BusinessRegistration from './BusinessRegistration';
import BusinessListings from './BusinessListings';
import SearchAndFilterScreen from './SearchAndFilterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import OfflineSync from './OfflineSync';
import Profile from './Profile';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthScreen">
        
        <Stack.Screen 
          name="AuthScreen" 
          component={AuthScreen} 
          options={{ title: 'Login', headerShown: true }} 
        />
        
        <Stack.Screen 
          name="HomeScreen" 
          component={HomeScreen} 
          options={{ title: 'Home', headerShown: false }} 
        />
        
        <Stack.Screen 
          name="BusinessRegistration" 
          component={BusinessRegistration} 
          options={{ title: 'Register Business', headerShown: true }} 
        />
        
        <Stack.Screen 
          name="BusinessListings" 
          component={BusinessListings} 
          options={{ title: 'Nearby Businesses', headerShown: true }} 
        />
        
        <Stack.Screen 
          name="SearchAndFilterScreen" 
          component={SearchAndFilterScreen} 
          options={{ title: 'Search & Filter', headerShown: true }} 
        />
        
        <Stack.Screen 
          name="ForgotPasswordScreen" 
          component={ForgotPasswordScreen} 
          options={{ title: 'Forgot Password', headerShown: true }} 
        />
        
        <Stack.Screen 
          name="OfflineSync" 
          component={OfflineSync} 
          options={{ title: 'Offline Sync', headerShown: true }} 
        />

        <Stack.Screen 
          name="Profile" 
          component={Profile} 
          options={{ title: 'Profile', headerShown: true }} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
