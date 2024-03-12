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
import CollectMoneyScreen from '../screens/ReachedDropScreen';
import ReachDropCollectCashScreen from '../screens/ReachedDropScreen';
import ReachedDropScreen from '../screens/ReachedDropScreen';
import TripSummaryScreen from '../screens/TripSummaryScreen';
import {useSelector} from 'react-redux';
import LocationScreen from '../screens/LocationScreen';

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
    <AuthNav.Navigator
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <AuthNav.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthNav.Screen name="Login" component={LoginScreen} />
      <AuthNav.Screen name="OTP" component={OTPVerificationScreen} />
      <AuthNav.Screen name="Location" component={LocationScreen} />
      <AuthNav.Screen name="PresonalDetail" component={PersonalDetailsScreen} />
    </AuthNav.Navigator>
  );
};

export const GBHomeNavigator = () => {
  return (
    <AuthNav.Navigator
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <AuthNav.Screen name="Home" component={HomeScreen} />
      <AuthNav.Screen name="TripSummary" component={TripSummaryScreen} />
      <AuthNav.Screen name="CollectMoney" component={ReachedDropScreen} />
      <AuthNav.Screen name="ReachPickup" component={ReachPickupScreen} />
      <AuthNav.Screen name="OrderPick" component={PickOrderScreen} />
    </AuthNav.Navigator>
  );
};

const Stack = createNativeStackNavigator();
export const AppNavigator = props => {
  const [showSplash, setShowSplash] = useState(true);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

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
        <Stack.Screen name="DashBoard" component={GBHomeNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
