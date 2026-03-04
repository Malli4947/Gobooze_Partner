import React, {useEffect, useState, useRef} from 'react';
import {LogBox, Platform} from 'react-native';
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
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import {enableScreens} from 'react-native-screens';
import logger from './src/utils/logger';

// import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
  check,
} from 'react-native-permissions';
import NotificationController from './src/screens/NotificationController';

LogBox.ignoreAllLogs();
const store = configureStore();

function App() {
  const timerRef = useRef(null);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    return enabled;
  };

  useEffect(() => {
    const subscribe = messaging().onTokenRefresh(token => {
      AsyncStorage.setItem('token', token);
    });
    return subscribe;
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        if (Platform.OS === 'ios') {
          enableScreens(false);
          await getFirebaseToken(); // iOS handles this immediately
        } else {
          timerRef.current = setTimeout(() => {
            permissionRequest();
          }, 1000);
        }

        const unsubscribe = messaging().onMessage(async remoteMessage => {
          logger.log('Foreground Message:', remoteMessage);
        });

        return () => {
          unsubscribe();
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
        };
      } catch (error) {
        logger.error('Initialization error:', error);
      }
    };

    initialize();
  }, []);

  const getFirebaseToken = async () => {
    const hasPermission = await requestUserPermission();
    if (!hasPermission) return null;

    await messaging().registerDeviceForRemoteMessages();

    try {
      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem('token', token);
        return token;
      } else {
        logger.warn(' No token yet, will wait for onTokenRefresh');
        return null;
      }
    } catch (e) {
      logger.error(' Error getting FCM Token:', e);
      return null;
    }
  };

  const permissionRequest = async () => {
    const systemVersion = DeviceInfo.getSystemVersion();
    if (parseInt(systemVersion, 10) >= 13) {
      check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
        .then(result => {
          switch (result) {
            case RESULTS.GRANTED:
              getFirebaseToken();
              break;
            default:
              notificationPermission();
              break;
          }
        })
        .catch(error => {
          logger.error('Permission check error:', error);
        });
    } else {
      logger.log('Android version < 13, skip permission request');
      getFirebaseToken();
    }
  };

  const notificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    if (result === RESULTS.GRANTED) {
      getFirebaseToken();
    } else {
      logger.warn('Permission denied or blocked, please enable from settings');
      openSettings().catch(() => {
        logger.warn('Cannot open settings');
      });
    }
  };

  const locationWatchIdRef = useRef(null);

  const getLatAndLong = async () => {
    // Clear existing watch if any
    if (locationWatchIdRef.current !== null) {
      Geolocation.clearWatch(locationWatchIdRef.current);
    }

    const combinedData = await AsyncStorage.getItem('USER_DATA');
    if (!combinedData) {
      logger.warn('getLatAndLong: USER_DATA not available');
      return;
    }

    locationWatchIdRef.current = Geolocation.watchPosition(
      position => {
        const lat = position.coords.longitude;
        const long = position.coords.latitude;
        postDriverLocation(lat, long);
      },
      error => {
        logger.error('Geolocation watch error:', error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        distanceFilter: 10, // Increased from 1 to reduce frequency
        interval: 30000, // Increased from 1000ms to 30s
        fastestInterval: 10000, // Increased from 2000ms to 10s
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
        `https://api.gobooze.com.au/order/api/orders/update-driver-location/${userId}`,
        obj,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );

      logger.log('Location update response:', res.status);
    } catch (error) {
      logger.error('Error posting driver location:', error);
    }
  };

  // Cleanup location watch on unmount
  useEffect(() => {
    return () => {
      if (locationWatchIdRef.current !== null) {
        Geolocation.clearWatch(locationWatchIdRef.current);
        locationWatchIdRef.current = null;
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ColorSchemeProvider>
        <Provider store={store}>
          <NotificationController />
          <AppNavigator />
        </Provider>
      </ColorSchemeProvider>
    </GestureHandlerRootView>
  );
}

export default App;
