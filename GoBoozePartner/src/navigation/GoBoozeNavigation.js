import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import PersonalDetailsScreen from '../screens/PersonalDetailsScreen';
import HomeScreen from '../screens/HomeScreen';
import ReachPickupScreen from '../screens/ReachPickupScreen';
import PickOrderScreen from '../screens/PickOrderScreen';
import CollectMoneyScreen from '../screens/CollectMoneyScreen';

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

export const GBHomeNavigator = () => {
  return (
    <AuthNav.Navigator screenOptions={{headerShown: false}}>
      <AuthNav.Screen name="CollectMoney" component={CollectMoneyScreen} />
      <AuthNav.Screen name="ReachPickup" component={ReachPickupScreen} />
      <AuthNav.Screen name="OrderPick" component={PickOrderScreen} />
      <AuthNav.Screen name="Home" component={HomeScreen} />
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
          <Stack.Screen name="Auth" component={GBHomeNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
