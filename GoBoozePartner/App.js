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
import {err} from 'react-native-svg';
import axios from 'axios';

LogBox.ignoreAllLogs();
const store = configureStore();

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      getLatAndLong();
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  const getLatAndLong = async () => {
    const combinedData = await AsyncStorage.getItem('USER_DATA');
    console.log('hii for 500 milliseconds');
    const id = Geolocation.watchPosition(
      position => {
        const lat = JSON.stringify(position.coords.longitude);
        const long = JSON.stringify(position.coords.latitude);
        postDriverLocation(lat, long);
      },
      error => {
        console.log(error, 'error--');
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        distanceFilter: 1,
        interval: 1000,
        fastestInterval: 2000,
      },
    );
  };

  const postDriverLocation = async (lat, long) => {
    try {
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      if (!combinedData) {
        throw new Error('User data is not available.');
      }

      const [accessToken, userId] = combinedData.split(':');
      if (!accessToken || !userId) {
        throw new Error('Invalid user data format.');
      }

      const obj = {
        location: {
          type: 'Point',
          coordinates: [lat, long],
        },
      };

      const res = await axios.patch(
        'https://devapigobooze.codefactstech.com/order/api/orders/update-driver-location/6658508a5f9586ce68675dc9 ',
        obj,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );

      console.log('Location update response:', res);
    } catch (error) {
      console.error('Error posting driver location:', error);
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
