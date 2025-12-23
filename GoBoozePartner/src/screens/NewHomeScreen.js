import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  TouchableNativeFeedback,
  Pressable,
  Alert,
  Platform,
  PermissionsAndroid,
  RefreshControl,
  SafeAreaView,
  NativeModules,
  NativeEventEmitter,
  FlatList,
  AppState
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import LocationPermissionModal from '../components/LocationPermissionModal';
import Geolocation from '@react-native-community/geolocation';
import {useColorScheme} from '../components/ColorSchemeContext';
import COLORS from '../constants/Colors';
import {rHeight, rWidth} from '../constants/PixelSize';
import {API_BASE_URL, GRAPHIK_FONT} from '../constants/Constant';
import OrderNavigationBar from '../components/OrderNavigationBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TotalEarningOrderView from '../components/TotalEarningOrderView';
import GBSegmentControl from '../components/GBSegmentControl';
import NewOrderAlertScreen from './NewOrderAlertScreen';
import CustomStatusBar from '../components/CustomStatusBar';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as appActions from '../redux/actions/appActionCreator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewSlideButton from '../components/NewSlideButton';
import {useDispatch} from 'react-redux';
import Song from '../assets/BearSound.mp3';
import OrdersCard from '../components/OrdersCard';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {pendingOrders} from '../redux/GoboozeApi';
import {onGettingCoordinates} from '../redux/slices/LocationSlices';
import {check, request, PERMISSIONS, RESULTS, openSettings} from 'react-native-permissions';
import {BackHandler} from 'react-native';
import NetworkSpeedIndicator from './NetworkSpeedIndicator';
import SignalStrengthComponent from './SignalStrengthComponent';
import logger from '../utils/logger';
var Sound = require('react-native-sound');
const {RNNetworkSpeed, MobileSignalModule, NetworkTypeModule} = NativeModules;
Sound.setCategory('Playback');
const screenWidth = Dimensions.get('screen').width - 30;

const NewHomeScreen = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocus = useIsFocused();

  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [modalData, setModaldata] = useState([]);
  const [orderAlreadyAccepted, setOrderAlreadyAccepted] = useState(false);

  const [insignSelectedIndex, setInsightSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [allPendingOrders, setAllpendingOrders] = useState([]);
  const [accepteddOrders, setAcceptedOrders] = useState([]);
  const [deliveredOrders, setDeliveriedOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const previousLengthRef = useRef(0);
  const dingRef = useRef(null);
  const soundTimeoutRef = useRef(null);

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkSeperator = isDarkTheme && {backgroundColor: COLORS.dark_theme_background};

  // ----------------------------- LOCATION PERMISSION ---------------------------------
  const checkLocationPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return hasPermission;
      } else {
        const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return status === 'granted';
      }
    } catch (error) {
      logger.error('Error checking location permission:', error);
      return false;
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        // First check if already granted
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (hasPermission) {
          return true;
        }

        // Request permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'GoBooze needs access to your location to track deliveries.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return status === RESULTS.GRANTED;
      }
    } catch (error) {
      logger.error('Error requesting location permission:', error);
      return false;
    }
  }, []);

  const checkLocationEnabled = useCallback(async () => {
    return await checkLocationPermission();
  }, [checkLocationPermission]);

 
  const checkIsActiveStatus = async () => {
  try {
    const combinedData = await AsyncStorage.getItem('USER_DATA');
    const [accessToken, userId] = combinedData?.split(':') ?? [];
    const res = await fetch(
      `https://api.gobooze.com.au/admin/api/partner/get-partner/${userId}`,
      { headers: { Authorization: `${accessToken}` } },
    );
    const data = await res.json();
    return data?.data?.is_active ?? false;
  } catch {
    return false;
  }
};


  const postDriverLocation = async (lat, long) => {
    try {
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      if (!combinedData) {
        logger.warn('postDriverLocation: USER_DATA not available');
        return;
      }
      const [accessToken, userId] = combinedData.split(':');
      logger.log('postDriverLocation: Posting location to server', {lat, long, userId});
      await axios.patch(
        `https://api.gobooze.com.au/order/api/orders/update-driver-location/${userId}`,
        {
          location: {type: 'Point', coordinates: [lat, long]},
        },
        {headers: {Authorization: `${accessToken}`}},
      );
      logger.log('postDriverLocation: Location posted successfully');
      } catch (error) {
        logger.error('Error posting location:', error.message || error);
      }
  };

  const getLatAndLong = useCallback(async () => {
    const isActive = await checkIsActiveStatus();
    if (!isActive) {
      logger.warn('getLatAndLong: User is not active, skipping location fetch');
      return;
    }

    // First check if permission is granted
    let hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      // Permission not granted - try to request it first
      hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        // Permission still not granted - show modal
        setModalVisible(true);
        return;
      }
    }

    // Try to use cached coordinates first if available and recent
    try {
      const savedCoords = await AsyncStorage.getItem('LAST_COORDINATES');
      if (savedCoords) {
        const coords = JSON.parse(savedCoords);
        // Use cached coordinates immediately to avoid delay
        setCurrentCoordinates(coords);
        dispatch(onGettingCoordinates({
          lattitude: coords.lat,
          longitude: coords.long
        }));
        logger.log('Using cached coordinates while fetching fresh location');
      }
    } catch (e) {
      logger.error('Error reading cached coordinates:', e);
    }

      // Permission is granted, try to get location
      // Using maximumAge: 3600000 (1 hour) to accept cached locations for faster response
      // This reduces timeout issues while still getting reasonably fresh locations
      logger.log('getLatAndLong: Attempting to get location...');
      Geolocation.getCurrentPosition(
        async position => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          const coords = {lat, long};
          logger.log('getLatAndLong: Location captured successfully', coords);
          setCurrentCoordinates(coords);
          await AsyncStorage.setItem('LAST_COORDINATES', JSON.stringify(coords));
          postDriverLocation(lat, long);
          dispatch(onGettingCoordinates({lattitude: lat, longitude: long}));
          setModalVisible(false);
        },
        async error => {
          // Check error code to determine if it's a permission issue
          // Error codes: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
          if (error.code === 1) {
            // Permission denied - try requesting again or show modal
            logger.warn('Geolocation permission denied');
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
              setModalVisible(true);
            } else {
              // Permission granted, retry getting location
              getLatAndLong();
            }
          } else {
            // Other errors (GPS signal, timeout, etc.) - don't show permission modal
            // Try to use cached coordinates if available (even if old)
            let usedCachedCoords = false;
            try {
              const savedCoords = await AsyncStorage.getItem('LAST_COORDINATES');
              if (savedCoords) {
                const coords = JSON.parse(savedCoords);
                setCurrentCoordinates(coords);
                dispatch(onGettingCoordinates({
                  lattitude: coords.lat,
                  longitude: coords.long
                }));
                usedCachedCoords = true;
                logger.log('Using cached coordinates due to location error:', error.code === 3 ? 'timeout' : error.message);
              } else {
                // No cached coordinates - log warning but don't show alert (non-blocking)
                logger.warn('Geolocation error and no cached coordinates available. Code:', error.code, 'Message:', error.message);
              }
            } catch (e) {
              logger.error('Error reading cached coordinates:', e);
            }
            
            // Only log error if we couldn't use cached coordinates
            if (!usedCachedCoords) {
              // Don't retry on timeout - it will likely timeout again
              // Instead, log the issue - user should set mock location on emulator or use cached coordinates
              if (error.code === 3) {
                logger.warn('Location timeout - this is normal on emulator without mock location. Please set a mock location in Extended Controls > Location, or the app will use cached coordinates if available.');
              } else {
                logger.warn('Geolocation error (non-permission) and no fallback available. Code:', error.code, 'Message:', error.message);
              }
            } else {
              // Successfully used cached coordinates - log as info, not error
              logger.log('Location fetch failed but using cached coordinates successfully');
            }
            
            // Don't show permission modal for non-permission errors
            // Keep modal state as is (don't force show/hide)
          }
        },
        {
          enableHighAccuracy: false, // Better for emulator - uses network/WiFi
          timeout: 15000, // 15 seconds timeout - faster failure on emulator without mock location
          maximumAge: 3600000, // Accept cached location up to 1 hour old (much better fallback)
          // Note: distanceFilter is only for watchPosition, not getCurrentPosition
        },
      );
  }, [dispatch, checkLocationPermission, requestLocationPermission]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
      fecthPendingOrders();
      const interval = setInterval(() => {
        fecthPendingOrders();
        fetchOrders();
      }, 15000);
      return () => clearInterval(interval);
    }, [fetchOrders, fecthPendingOrders]),
  );
  // ----------------------------- FETCH ORDERS ---------------------------------
  const fetchOrders = useCallback(async () => {
  const isActive = await checkIsActiveStatus();

  // Load cached data first
  const cachedDelivered = await AsyncStorage.getItem("CACHED_DELIVERED_ORDERS");
  const cachedActive = await AsyncStorage.getItem("CACHED_ACTIVE_ORDERS");
  const cachedPending = await AsyncStorage.getItem("CACHED_PENDING_ORDERS");

  let deliveredOrders = cachedDelivered ? JSON.parse(cachedDelivered) : [];
  let activeOrders = cachedActive ? JSON.parse(cachedActive) : [];
  let pendingOrders = cachedPending ? JSON.parse(cachedPending) : [];

  // Set cached data to UI
  setDeliveriedOrders(deliveredOrders);
  setAcceptedOrders(activeOrders);
  setAllpendingOrders(pendingOrders);

  if (!isActive) {
    logger.log(" User not active → showing cached orders only");
    return;
  }

  try {
    const combinedData = await AsyncStorage.getItem("USER_DATA");
    if (!combinedData) return;
    const [accessToken, userId] = combinedData.split(":");
    try {
      const res = await axios.post(
        `https://api.gobooze.com.au/order/api/orders/get-delivery-user-ongoing-orders/${userId}`,
        {},
        { headers: { Authorization: `${accessToken}` } }
      );
      // Use slice().reverse() to avoid mutating original array
      const apiData = Array.isArray(res.data?.data) ? [...res.data.data].reverse() : [];
      deliveredOrders = apiData;
      await AsyncStorage.setItem("CACHED_DELIVERED_ORDERS", JSON.stringify(apiData));
    } catch (err) {
      logger.warn(" Delivered API failed:", err?.response?.data || err?.message);
    }
    try {
      const res = await axios.post(
        `https://api.gobooze.com.au/order/api/orders/get-delivery-user-picked-orders`,
        {},
        { headers: { Authorization: `${accessToken}` } }
      );
      const apiData = Array.isArray(res.data?.data) ? [...res.data.data].reverse() : [];
      activeOrders = apiData;
      await AsyncStorage.setItem("CACHED_ACTIVE_ORDERS", JSON.stringify(apiData));
    } catch (err) {
      logger.warn("Active API failed:", err?.response?.data || err?.message);
    }
    try {
      const res = await axios.get(
        `https://api.gobooze.com.au/order/api/orders/get-delivery-user-unassigned-orders/${userId}`,
        { order_status: "pending" },
        { headers: { Authorization: `${accessToken}` } }
      );

      const apiData =
        res.data?.success && Array.isArray(res.data?.data)
          ? [...res.data.data].reverse()
          : [];
      pendingOrders = apiData;
      await AsyncStorage.setItem("CACHED_PENDING_ORDERS", JSON.stringify(apiData));
    } catch (err) {
      logger.warn(" Pending API failed:", err?.response?.data || err?.message);
    }
    setDeliveriedOrders(deliveredOrders);
    setAcceptedOrders(activeOrders);
    setAllpendingOrders(pendingOrders);
  } catch (e) {
    logger.error("fetchOrders general error:", e?.message);
  }
}, []);

// const fecthPendingOrders = async () => {
//   const isActive = await checkIsActiveStatus();
//   // console.log("🔍 checkIsActiveStatus →", isActive);
//   if (!isActive) {
//     console.warn(" User not active – skipping pending orders fetch");
//     return;
//   }

//   try {
//     const combinedData = await AsyncStorage.getItem("USER_DATA");
//     if (!combinedData) {
//       console.error(" fetchPendingOrders: USER_DATA is null/undefined");
//       return;
//     }

//     const [accessToken, userId] = combinedData.split(":");
//     // console.log("fetchPendingOrders with userId:", userId);

//     const res = await axios.get(
//       `https://api.gobooze.com.au/order/api/orders/get-delivery-user-unassigned-orders/${userId}`,
//       { order_status: "pending" },
//       { headers: { Authorization: `${accessToken}` } }
//     );
//     const newData = Array.isArray(res.data?.data) ? res.data.data.reverse() : [];
//     if (newData.length > previousLengthRef.current) {
//       console.log(" New pending orders arrived!");
//       playPause();
//     }
//     previousLengthRef.current = newData.length;
//     setAllpendingOrders(newData);
//     await AsyncStorage.setItem("CACHED_PENDING_ORDERS", JSON.stringify(newData));
//   } catch (err) {
//     console.error(" fetchPendingOrders failed:", err?.response?.data || err?.message);
//   }
// };

  const fecthPendingOrders = useCallback(async () => {
    const isActive = await checkIsActiveStatus();
    if (!isActive) return;
    try {
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      const [accessToken, userId] = combinedData?.split(':') ?? [];

      const checkingPendingOrders = await axios.post(
        `https://api.gobooze.com.au/order/api/orders/get-delivery-user-unassigned-orders/${userId}`,
        {
          order_status: 'pending',
        },
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );
      const responseData = checkingPendingOrders.data?.data;
      if (!Array.isArray(responseData)) {
        logger.warn('fecthPendingOrders: Invalid response data format');
        return;
      }
      // Use slice().reverse() to avoid mutating original array
      const newData = [...responseData].reverse();
      if (newData.length > previousLengthRef.current) {
        playPause();
      }
      previousLengthRef.current = newData.length;

      setAllpendingOrders(newData);
      await AsyncStorage.setItem("CACHED_PENDING_ORDERS", JSON.stringify(newData));
      
      // Clear sound timeout
      if (soundTimeoutRef.current) {
        clearTimeout(soundTimeoutRef.current);
      }
      soundTimeoutRef.current = setTimeout(() => {
        if (dingRef.current) {
          dingRef.current.stop();
        }
        soundTimeoutRef.current = null;
      }, 2500);
    } catch (e) {
      logger.error('fecthPendingOrders error:', e?.message || e);
    }
  }, [playPause]);



  // ----------------------------- ORDER CARD PRESS ---------------------------------
//   const handleOrderPress = useCallback(async (item) => {
//   if (showNewOrderModal) return;
//   try {
//     const locationEnabled = await checkLocationEnabled();
//     if (!locationEnabled) {
//       Alert.alert(
//         'Location Services Disabled',
//         'Please enable location services to proceed.',
//         [{ text: 'OK' }]
//       );
//       return;
//     }

//     // --- Use currentCoordinates or fallback to stored coordinates ---
//     let coordinates = currentCoordinates;
//     if (!coordinates) {
//       const savedCoords = await AsyncStorage.getItem("LAST_COORDINATES");
//       if (savedCoords) {
//         coordinates = JSON.parse(savedCoords);
//         setCurrentCoordinates(coordinates);
//         dispatch(onGettingCoordinates({ lattitude: coordinates.lat, longitude: coordinates.long }));
//       } else {
//         Alert.alert(
//           'Unable to Retrieve Location',
//           'Please ensure your location services are enabled and try again.',
//           [{ text: 'OK' }]
//         );
//         return;
//       }
//     }

//     // --- Get accessToken and userId from storage ---
//     const combinedData = await AsyncStorage.getItem('USER_DATA');
//     const [accessToken, userId] = combinedData?.split(':') ?? [];

//     let isActive = true; // default assume active
//     try {
//       // Try to fetch user status
//       const res = await axios.get(
//         `https://api.gobooze.com.au/admin/api/partner/get-partner/${userId}`,
//         { headers: { Authorization: accessToken } }
//       );
//       isActive = res.data?.data?.is_active ?? true;
//     } catch (err) {
//       console.warn(" Network failed, using local status:", err.message);
//       // Optionally, you can read a locally cached partner info if you saved it before
//       // const cachedPartner = await AsyncStorage.getItem("CACHED_PARTNER_INFO");
//       // isActive = cachedPartner ? JSON.parse(cachedPartner).is_active : true;
//     }

//     if (!isActive) {
//       Alert.alert(
//         'Alert: You are Currently Offline',
//         'To accept new orders, Please go Online.',
//         [{ text: 'OK' }]
//       );
//       return;
//     }

//     // --- Open modal or navigate ---
//     if (insignSelectedIndex === 0 ) {
//       setModaldata(item);
//       setShowNewOrderModal(true);
//     } else if (insignSelectedIndex === 1) {
//       navigation.navigate('ReachMapDrop', { orderData: item });
//     }
//     else if (insignSelectedIndex === 2) {
//       navigation.navigate('ReachMapDrop', { orderData: item });
//     }

//   } catch (error) {
//     // console.error('Error in handleOrderPress:', error.message);
//     Alert.alert('Error', 'Something went wrong. Please try again.', [{ text: 'OK' }]);
//   }
// };

  const handleOrderPress = useCallback(async (item) => {
    if (showNewOrderModal) return;

    try {
      const hasPermission = await checkLocationPermission();
      if (!hasPermission) {
        // Show permission modal instead of alert
        setModalVisible(true);
        return;
      }

      // Get coordinates
      let coordinates = currentCoordinates;
      if (!coordinates) {
        // Try to get from cache first
        const savedCoords = await AsyncStorage.getItem("LAST_COORDINATES");
        if (savedCoords) {
          coordinates = JSON.parse(savedCoords);
          setCurrentCoordinates(coordinates);
          dispatch(onGettingCoordinates({
            lattitude: coordinates.lat,
            longitude: coordinates.long
          }));
        } else {
          // No cached coordinates - try to fetch location on-demand with optimized settings
          try {
            const position = await new Promise((resolve, reject) => {
              Geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                  enableHighAccuracy: false, // Use network/WiFi for faster response (better for emulator)
                  timeout: 15000, // 15 seconds - increased timeout for emulator
                  maximumAge: 300000, // Accept location up to 5 minutes old (much better fallback)
                }
              );
            });
            
            coordinates = {
              lat: position.coords.latitude,
              long: position.coords.longitude
            };
            setCurrentCoordinates(coordinates);
            await AsyncStorage.setItem('LAST_COORDINATES', JSON.stringify(coordinates));
            dispatch(onGettingCoordinates({
              lattitude: coordinates.lat,
              longitude: coordinates.long
            }));
          } catch (locationError) {
            // Location fetch failed - try to use cached coordinates first
            let hasCachedCoords = false;
            try {
              const savedCoords = await AsyncStorage.getItem("LAST_COORDINATES");
              if (savedCoords) {
                const coords = JSON.parse(savedCoords);
                coordinates = coords;
                setCurrentCoordinates(coords);
                dispatch(onGettingCoordinates({
                  lattitude: coords.lat,
                  longitude: coords.long
                }));
                hasCachedCoords = true;
                logger.log('Using cached coordinates after location fetch failure');
                // Continue with cached coordinates - don't show error
              }
            } catch (e) {
              logger.error('Error reading cached coordinates:', e);
            }

            // Only show error if we don't have cached coordinates
            if (!hasCachedCoords) {
              logger.warn('Failed to get location on-demand:', locationError.message, 'Code:', locationError.code);
              
              let errorMessage = 'Unable to get your current location. ';
              if (locationError.code === 3) {
                errorMessage += 'Location request timed out. ';
                if (__DEV__) {
                  errorMessage += 'For emulator: Please set a mock location in Extended Controls > Location.';
                } else {
                  errorMessage += 'Please check your GPS signal and try again.';
                }
              } else if (locationError.code === 2) {
                errorMessage += 'GPS signal is weak. Please move to an area with better signal.';
              } else if (locationError.code === 1) {
                // Permission denied - should not happen here but handle it
                errorMessage = 'Location permission denied. Please grant permission in settings.';
                setModalVisible(true);
                return;
              } else {
                errorMessage += 'Please ensure location services are enabled and try again.';
              }
              logger.error('Location error:', errorMessage);
              Alert.alert(
                'Location Unavailable',
                errorMessage,
                [{ text: 'OK' }]
              );
              return;
            }
            // If we have cached coordinates, continue with the flow
          }
        }
      }

      // Get logged-in userId
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      const [accessToken, userId] = combinedData?.split(':') ?? [];

      // Check user active
      let isActive = true;
      try {
        const res = await axios.get(
          `https://api.gobooze.com.au/admin/api/partner/get-partner/${userId}`,
          { headers: { Authorization: accessToken } }
        );
        isActive = res.data?.data?.is_active ?? true;
      } catch (err) {
        logger.warn("Network error:", err.message);
      }

      if (!isActive) {
        Alert.alert(
          'Alert: You are Currently Offline',
          'To accept new orders, please go Online.',
          [{ text: 'OK' }]
        );
        return;
      }

      // -------------------------------------
      // 🔥 IMPORTANT: CHECK IF ORDER BELONGS TO USER
      // -------------------------------------

      const assignedUserId = item?.delivery_user;
      const assignedUserName = item?.deliveryUserDetails?.full_name ?? "Someone";

      // If order belongs to another driver
      if (assignedUserId && assignedUserId !== userId) {
        Alert.alert(
          'Order Already Picked',
          `This order was accepted by ${assignedUserName}.`,
          [{ text: 'OK' }]
        );
        return;
      }

      // -------------------------------------
      // 🔥 NOW HANDLE TAB LOGIC
      // -------------------------------------

      // UNPICKED → show accept modal
      if (insignSelectedIndex === 0) {
        setModaldata(item);
        setShowNewOrderModal(true);
        return;
      }

      // PICKED or MY ORDERS → navigate
      if (insignSelectedIndex === 1 || insignSelectedIndex === 2) {
        navigation.navigate('ReachMapDrop', { orderData: item });
        return;
      }

    } catch (error) {
      logger.error('handleOrderPress error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.', [{ text: 'OK' }]);
    }
  }, [insignSelectedIndex, navigation, dispatch, currentCoordinates, showNewOrderModal]);


  // ----------------------------- REFRESH ---------------------------------
  const onRefresh = useCallback(async () => {
    setRefresh(true);
    try {
      await Promise.all([fetchOrders(), fecthPendingOrders()]);
    } catch (error) {
      logger.error('onRefresh error:', error);
    } finally {
      setRefresh(false);
    }
  }, [fetchOrders, fecthPendingOrders]);

  // ----------------------------- EFFECTS ---------------------------------
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const playPause = useCallback(() => {
    if (!dingRef.current) {
      dingRef.current = new Sound(
        Platform.OS == 'android' ? Song : 'BearSound.mp3',
        Sound.MAIN_BUNDLE,
        error => {
          if (error) {
            logger.error('Sound initialization error:', error);
            return;
          }
        },
      );
    }
    dingRef.current.play(success => {
      if (success) {
        // Don't recursively call playPause - this causes infinite loop
        // Sound will play once and stop naturally
      }
    });
  }, []);

 

  useEffect(() => {
    let locInterval = null;
    
    const init = async () => {
      // First try to request permission if not granted
      let hasPermission = await checkLocationPermission();
      if (!hasPermission) {
        hasPermission = await requestLocationPermission();
      }
      
      if (hasPermission) {
        // Permission granted - get location and set up interval
        getLatAndLong();
        locInterval = setInterval(() => getLatAndLong(), 120000);
      } else {
        // Permission not granted - show modal
        setModalVisible(true);
      }
    };
    
    init();
    
    // Cleanup on unmount
    return () => {
      if (locInterval) {
        clearInterval(locInterval);
      }
      if (dingRef.current) {
        dingRef.current.stop();
        dingRef.current.release();
        dingRef.current = null;
      }
      if (soundTimeoutRef.current) {
        clearTimeout(soundTimeoutRef.current);
        soundTimeoutRef.current = null;
      }
    };
  }, [getLatAndLong, checkLocationPermission, requestLocationPermission]);

  // Listen for app state changes to re-check permissions when user returns from settings
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (nextAppState === 'active' && modalVisible) {
        // User returned to app - re-check permissions
        const hasPermission = await checkLocationPermission();
        if (hasPermission) {
          setModalVisible(false);
          // Try to get location now that permission is granted
          getLatAndLong();
        }
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [modalVisible, checkLocationPermission, getLatAndLong]);

  // ----------------------------- UI ---------------------------------
  const segmentLabels = useMemo(
    () => [
      'UNPICKED ORDERS',
      'PICKED ORDERS',
      'MY ORDERS',
    ],
    [],
  );

  const selectedOrderCount =
  insignSelectedIndex === 0
    ? allPendingOrders?.length || 0
    : insignSelectedIndex === 1
    ? accepteddOrders?.length || 0
    : insignSelectedIndex === 2
    ? deliveredOrders?.length || 0
    : 0;

  const currentOrders = useMemo(() => {
    return insignSelectedIndex === 0
      ? allPendingOrders
      : insignSelectedIndex === 1
      ? accepteddOrders
      : insignSelectedIndex === 2
      ? deliveredOrders
      : [];
  }, [insignSelectedIndex, allPendingOrders, accepteddOrders, deliveredOrders]);

  const ListHeaderComponent = useMemo(() => (
    <>
      <View style={styles.horizontalMargin}>
        <Text
          style={[
            styles.totalEarningText,
            isDarkTheme && {color: COLORS.dark_primary_text},
          ]}>
          Orders
        </Text>
        <View style={styles.earningOrderContainer}>
          <TotalEarningOrderView title="Orders" value={allPendingOrders.length} />
          <TotalEarningOrderView title="Active Orders" value={deliveredOrders.length} />
        </View>
      </View>

      <View style={[styles.seperator, darkSeperator]} />

      <View
        style={{
          padding: 10,
          paddingLeft: 0,
          backgroundColor: isDarkTheme ? COLORS.dark_con : COLORS.light_con,
        }}>
        <View style={styles.horizontalMargin}>
          <Text
            style={[
              styles.totalEarningText,
              {marginBottom: 20},
              isDarkTheme && {color: COLORS.dark_primary_text},
            ]}>
            Orders (<Text style={{color: '#D3178A'}}>{selectedOrderCount}</Text>)
          </Text>
          <GBSegmentControl
            width={screenWidth}
            segmentBorderRadius={10}
            inactiveBgColor={isDarkTheme && '#00000070'}
            tintColor={isDarkTheme ? '#3F444D' : '#FFF'}
            inactiveFont={isDarkTheme && '#FFFFFFBF'}
            activeFont={isDarkTheme ? '#FFF' : COLORS.light_primary_text}
            segmentArray={segmentLabels}
            selectedIndex={insignSelectedIndex}
            onValueChange={index => setInsightSelectedIndex(index)}
          />
        </View>
      </View>
    </>
  ), [isDarkTheme, allPendingOrders.length, deliveredOrders.length, selectedOrderCount, segmentLabels, insignSelectedIndex, screenWidth, darkSeperator]);

  const ListFooterComponent = useMemo(() => (
    <View style={{height: 100}} />
  ), []);

  return (
    <SafeAreaView style={[styles.container, isDarkTheme && styles.dark_container]}>
      <LocationPermissionModal 
        modalVisible={modalVisible} 
        dismissModal={() => setModalVisible(false)}
        onPermissionGranted={async () => {
          const hasPermission = await checkLocationPermission();
          if (hasPermission) {
            setModalVisible(false);
            getLatAndLong();
          }
        }}
      />

      <NewOrderAlertScreen
        orderAlreadyAccepted={orderAlreadyAccepted}
        modalVisible={showNewOrderModal}
        dismissModal={() => setShowNewOrderModal(!showNewOrderModal)}
        onReachedToEnd={() => props.navigation.navigate('ReachPickup')}
        orderDetails={modalData}
        denyClick={() => setShowNewOrderModal(false)}
      />

      <View>
        <OrderNavigationBar />
        <View style={[styles.seperator, darkSeperator]} />
      </View>

      {/* <SignalStrengthComponent /> */}

      <OrdersCard
        orderRequests={currentOrders}
        onOrderPress={handleOrderPress}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  accessToken: state.auth.bearerAccessToken,
  loginUserId: state.auth.loginUserId,
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(appActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewHomeScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  dark_container: {
    backgroundColor: COLORS.dark_con,
  },
  seperator: {
    backgroundColor: COLORS.light_theme_background,
    height: rHeight(9),
    width: '100%',
    marginTop: rHeight(6),
  },
  totalEarningText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(20),
    color: COLORS.light_primary_text,
  },
  horizontalMargin: {
    marginHorizontal: 15,
    marginVertical: rHeight(15),
  },
  earningOrderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: rHeight(20),
    alignItems: 'center',
  },
  verticalSeperator: {
    width: 2,
    height: '70%',
    backgroundColor: '#F1F3F9',
  },
});

