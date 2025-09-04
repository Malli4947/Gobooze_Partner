import React, {useEffect, useState, useRef} from 'react';
import {LogBox,Platform} from 'react-native';
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
import { enableScreens } from 'react-native-screens';

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

  console.log("🔑 Notification permission:", enabled, authStatus);
  return enabled;
};

useEffect(() => {
  const subscribe = messaging().onTokenRefresh(token => {
    console.log("♻️ FCM Token refreshed:", token);
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
          console.log('🔥 Foreground Message:', remoteMessage);
        });

        return () => {
          unsubscribe();
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
        };
      } catch (error) {
        console.log('🔥 Initialization error:', error);
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
      console.log("✅ Initial FCM Token:", token);
      await AsyncStorage.setItem('token', token);
      return token;
    } else {
      console.warn("⚠️ No token yet, will wait for onTokenRefresh");
      return null;
    }
  } catch (e) {
    console.log("❌ Error getting FCM Token:", e);
    return null;
  }
};



const permissionRequest = async () => {
    const systemVersion = DeviceInfo.getSystemVersion();
    console.log("📱 Android version:", systemVersion);

    if (parseInt(systemVersion, 10) >= 13) {
      check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
        .then(result => {
          console.log("🔍 Notification permission status:", result);
          switch (result) {
            case RESULTS.GRANTED:
              getFirebaseToken(); break;
            default:
              notificationPermission(); break;
          }
        })
        .catch(error => {
          console.log('❌ Permission check error:', error);
        });
    } else {
      console.log('⚠️ Android version < 13, skip permission request');
      getFirebaseToken();
    }
  };

const notificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    console.log("📥 Requested notification permission:", result);

    if (result === RESULTS.GRANTED) {
      console.log("✅ Permission granted");
      getFirebaseToken();
    } else {
      console.warn("⛔ Permission denied or blocked, please enable from settings");
      openSettings().catch(() => {
        console.warn("⚠️ Cannot open settings");
      });
    }
  };



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
        'https://api.gobooze.com.au/order/api/orders/update-driver-location/6658508a5f9586ce68675dc9 ',
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
