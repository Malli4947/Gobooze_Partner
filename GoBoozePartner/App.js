import React, {useEffect, useState, useRef} from 'react';
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
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
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

  useEffect(() => {
    try {
      if (Platform.OS === 'ios') {
        enableScreens(false);
      }
    } catch (error) {
      console.log(error);
    }

    if (Platform.OS === 'android') {
      timerRef.current = setTimeout(() => {
        permissionRequest();
      }, 1000);
    } else {
      getFirebaseToken();
    }

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage', remoteMessage);
    });
    // return () => {
    //   unsubscribe();
    //   if (timerRef.current) {
    //     clearTimeout(timerRef.current);
    //   }
    // };
  }, []);

const getFirebaseToken = async () => {
if (Platform.OS === 'ios') {
  messaging()
    .requestPermission()
    .then(authStatus => {
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        // console.log('Authorization status:', authStatus);
        getFirebaseToken();
      }
    })
    .catch(error => {
      console.log('iOS permission error:', error);
    });
}
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  console.log('Firebase Token:', token);
  await AsyncStorage.setItem('token', token);
};

  // const requestPermissionToken = () => {
  //   messaging()
  //     .requestPermission()
  //     .then(() => {
  //       getToken();
  //     })
  //     .catch(error => {
  //       console.log('permission rejected ' + error);
  //     });
  // };

  // const getToken = () => {
  //   messaging()
  //     .getToken()
  //     .then(async token => {
  //       console.log('push token ' + token);
  //       await AsyncStorage.setItem('token', token);
  //     })
  //     .catch(error => {
  //       console.log('error getting push token ' + error);
  //     });
  // };
  const permissionRequest = async () => {
    // console.log('Executing permission request function: ');
    let systemVersion = DeviceInfo.getSystemVersion();
    // console.log('This is the SystemVersion: ' + systemVersion);
    if (systemVersion > 12) {
      // console.log('This is the systemversion: ' + systemVersion);
      check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              notificationPermission();
              break;
            case RESULTS.DENIED:
              notificationPermission();
              break;
            case RESULTS.LIMITED:
              notificationPermission();
              break;
            case RESULTS.GRANTED:
              getFirebaseToken();
              // console.log(CONSTANTS.PERMISSION_MESSGAE.GRANTED_PERMISSION);
              break;
            case RESULTS.BLOCKED:
              notificationPermission();
              break;
          }
        })
        .catch(error => {
          // …
          console.log('Got an error: ');
          console.log(error);
        });
    } else {
      console.log('getting into else block');
      getFirebaseToken();
    }
  };

  const notificationPermission = async () => {
    request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS).then(result => {
      // switch (result) {
      //   case RESULTS.UNAVAILABLE:
      //     openSettings().catch(() =>
      //       console.warn(CONSTANTS.PERMISSION_MESSGAE.CANNOT_OPEN),
      //     );
      //     console.log(CONSTANTS.PERMISSION_MESSGAE.UNIAVAILABLE_PERMISSION);
      //     break;
      //   case RESULTS.DENIED:
      //     openSettings().catch(() =>
      //       console.warn(CONSTANTS.PERMISSION_MESSGAE.CANNOT_OPEN),
      //     );
      //     console.log(CONSTANTS.PERMISSION_MESSGAE.DENIED_PERMISSION);
      //     break;
      //   case RESULTS.LIMITED:
      //     openSettings().catch(() =>
      //       console.warn(CONSTANTS.PERMISSION_MESSGAE.CANNOT_OPEN),
      //     );
      //     console.log(CONSTANTS.PERMISSION_MESSGAE.LIMITED_PERMISSION);
      //     break;
      //   case RESULTS.GRANTED:
      //     getFirebaseToken();
      //     console.log(CONSTANTS.PERMISSION_MESSGAE.GRANTED_PERMISSION);
      //     break;
      //   case RESULTS.BLOCKED:
      //     // Toast.show(CONSTANTS.PERMISSION_MESSGAE.PERMISSION_NOTITIFCATION_MESSAGE);
      //     openSettings().catch(() =>
      //       console.warn(CONSTANTS.PERMISSION_MESSGAE.CANNOT_OPEN),
      //     );
      //     console.log(CONSTANTS.PERMISSION_MESSGAE.BLOCKED_PERMISSION);
      //     break;
      // }
    });
  };

  useEffect(() => {
    // const interval = setInterval(() => {
    //   // getLatAndLong();
    // }, 18000);
    // return () => clearInterval(interval);
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

