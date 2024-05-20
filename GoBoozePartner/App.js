import React, {useEffect, useState} from 'react';
import {LogBox} from 'react-native';
// import SplashScreen from 'react-native-splash-screen';
import {ColorSchemeProvider} from './src/components/ColorSchemeContext';
import AppNavigator from './src/navigation/GoBoozeNavigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {enableLatestRenderer} from 'react-native-maps';
import configureStore from './src/redux/store';
import {Provider} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

LogBox.ignoreAllLogs();
const store = configureStore();

function App() {
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchData();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);
  const fetchData = async () => {
    try {
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      const [accessToken, userId] = combinedData?.split(':') ?? [];
      if (userId) {
        Geolocation.getCurrentPosition(
          position => {
            const currentLongitude = JSON.stringify(position.coords.longitude);
            const currentLatitude = JSON.stringify(position.coords.latitude);
          },
          error => {
            console.log('💕 ~ file: App.js:39 ~ fetchData ~ error:', error);
          },
          {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 1000,
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ColorSchemeProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </GestureHandlerRootView>
    </ColorSchemeProvider>
  );
}

export default App;
