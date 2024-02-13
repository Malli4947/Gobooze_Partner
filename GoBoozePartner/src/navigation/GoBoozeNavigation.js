import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import PersonalDetailsScreen from '../screens/PersonalDetailsScreen';

const AuthNav = createNativeStackNavigator();
const SplashNav = createNativeStackNavigator();

export const GBSplashNavigator = () => {
  return (
    <SplashNav.Navigator screenOptions={{headerShown: false}}>
      <AuthNav.Screen name="SplashScreen" component={SplashScreen} />
    </SplashNav.Navigator>
  );
};

export const GBAuthNavigator = () => {
  return (
    <AuthNav.Navigator screenOptions={{headerShown: false}}>
      <AuthNav.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthNav.Screen name="Login" component={LoginScreen} />
      <AuthNav.Screen name="OTP" component={OTPVerificationScreen} />
      <AuthNav.Screen name="PresonalDetail" component={PersonalDetailsScreen} />
    </AuthNav.Navigator>
  );
};

const Stack = createNativeStackNavigator();
export const AppNavigator = props => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 1000);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {showSplash && (
          <Stack.Screen name="Splash" component={GBSplashNavigator} />
        )}
        {showSplash === false && (
          <Stack.Screen name="Auth" component={GBAuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
