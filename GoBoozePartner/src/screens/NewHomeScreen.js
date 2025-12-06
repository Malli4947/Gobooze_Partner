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
  NativeEventEmitter
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import LocationPermissionModal from '../components/LocationPermissionModal';
import Geolocation from '@react-native-community/geolocation';
import {useColorScheme} from '../components/ColorSchemeContext';
import COLORS from '../constants/Colors';
import { useMemo } from 'react';
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
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewSlideButton from '../components/NewSlideButton';
import {useDispatch} from 'react-redux';
import Song from '../assets/BearSound.mp3';
import OrdersCard from '../components/OrdersCard';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {pendingOrders} from '../redux/GoboozeApi';
import {onGettingCoordinates} from '../redux/slices/LocationSlices';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {BackHandler} from 'react-native';
import NetworkSpeedIndicator from './NetworkSpeedIndicator';
import SignalStrengthComponent from './SignalStrengthComponent';
var Sound = require('react-native-sound');
const {RNNetworkSpeed, MobileSignalModule, NetworkTypeModule} = NativeModules;
Sound.setCategory('Playback');

var ding = new Sound(
  Platform.OS == 'android' ? Song : 'BearSound.mp3',
  Sound.MAIN_BUNDLE,
  error => {
    if (error) {
      return;
    }
  },
);
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
  // console.log('allPendingOrders', allPendingOrders);
  const [accepteddOrders, setAcceptedOrders] = useState([]);
  console.log('accepteddOrders', accepteddOrders); 
  const [deliveredOrders, setDeliveriedOrders] = useState([]);
// console.log('deliveredOrderss',deliveredOrders)
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const previousLengthRef = useRef(0);

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkSeperator = isDarkTheme && {backgroundColor: COLORS.dark_theme_background};

  const socket = io('https://gobooze-test.codefactstech.com');

  // ----------------------------- LOCATION PERMISSION ---------------------------------
  const checkLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      } else {
        const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return status === 'granted';
      }
    } catch {
      return false;
    }
  };

  const checkLocationEnabled = async () => {
    return await checkLocationPermission();
  };

 
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
      if (!combinedData) return;
      const [accessToken, userId] = combinedData.split(':');
      await axios.patch(
        `https://api.gobooze.com.au/order/api/orders/update-driver-location/${userId}`,
        {
          location: {type: 'Point', coordinates: [lat, long]},
        },
        {headers: {Authorization: `${accessToken}`}},
      );
    } catch (error) {
      console.log('Error posting location:', error.message);
    }
  };

  const getLatAndLong = useCallback(async () => {
    const isActive = await checkIsActiveStatus();
    if (!isActive) return;

    Geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const coords = {lat, long};
        setCurrentCoordinates(coords);
        await AsyncStorage.setItem('LAST_COORDINATES', JSON.stringify(coords));
        postDriverLocation(lat, long);
        dispatch(onGettingCoordinates({lattitude: lat, longitude: long}));
        setModalVisible(false);
      },
      error => {
        console.warn('Geolocation error:', error.message);
        setModalVisible(true);
        setCurrentCoordinates(null);
      },
      {enableHighAccuracy: false, timeout: 10000, distanceFilter: 1},
    );
  }, []);

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
const fetchOrders = async () => {
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
    console.log(" User not active → showing cached orders only");
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
      const apiData = res.data?.data?.reverse() ?? [];
      deliveredOrders = apiData;
      await AsyncStorage.setItem("CACHED_DELIVERED_ORDERS", JSON.stringify(apiData));
    } catch (err) {
      console.warn(" Delivered API failed:", err?.response?.data || err?.message);
    }
    try {
      const res = await axios.post(
        // `https://api.gobooze.com.au/order/api/orders/get-delivery-user-ongoing-orders/${userId}`,
        `https://api.gobooze.com.au/order/api/orders/get-delivery-user-picked-orders`,
        {},
        { headers: { Authorization: `${accessToken}` } }
      );
      const apiData = res.data?.data?.reverse() ?? [];
      activeOrders = apiData;
      await AsyncStorage.setItem("CACHED_ACTIVE_ORDERS", JSON.stringify(apiData));
    } catch (err) {
      console.warn("Active API failed:", err?.response?.data || err?.message);
    }
    try {
      const res = await axios.get(
        `https://api.gobooze.com.au/order/api/orders/get-delivery-user-unassigned-orders/${userId}`,
        { order_status: "pending" },
        { headers: { Authorization: `${accessToken}` } }
      );

      const apiData =
        res.data?.success && Array.isArray(res.data?.data)
          ? res.data.data.reverse()
          : [];
      pendingOrders = apiData;
      await AsyncStorage.setItem("CACHED_PENDING_ORDERS", JSON.stringify(apiData));
    } catch (err) {
      console.warn(" Pending API failed:", err?.response?.data || err?.message);
    }
    setDeliveriedOrders(deliveredOrders);
    setAcceptedOrders(activeOrders);
    setAllpendingOrders(pendingOrders);
  } catch (e) {
    console.error("fetchOrders general error:", e?.message);
  }
};

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

const fecthPendingOrders = async () => {
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
      // console.log(checkingPendingOrders, 'checkingPendingOrders=======');
      const newData = checkingPendingOrders.data.data.reverse();
      if (newData.length > previousLengthRef.current) {
        playPause();
      }
      previousLengthRef.current = newData.length;

      setListOfRequests(newData);
      setTimeout(() => {
        ding.stop();
      }, 2500);
    } catch (e) {
      // Handle error
    }
  };



  // ----------------------------- ORDER CARD PRESS ---------------------------------
//   const handleOrderPress = async (item) => {
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

const handleOrderPress = async (item) => {
  if (showNewOrderModal) return;

  try {
    const locationEnabled = await checkLocationEnabled();
    if (!locationEnabled) {
      Alert.alert(
        'Location Services Disabled',
        'Please enable location services to proceed.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Get coordinates
    let coordinates = currentCoordinates;
    if (!coordinates) {
      const savedCoords = await AsyncStorage.getItem("LAST_COORDINATES");
      if (savedCoords) {
        coordinates = JSON.parse(savedCoords);
        setCurrentCoordinates(coordinates);
        dispatch(onGettingCoordinates({
          lattitude: coordinates.lat,
          longitude: coordinates.long
        }));
      } else {
        Alert.alert(
          'Unable to Retrieve Location',
          'Please ensure your location services are enabled.',
          [{ text: 'OK' }]
        );
        return;
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
      console.warn("Network error:", err.message);
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
    Alert.alert('Error', 'Something went wrong. Please try again.', [{ text: 'OK' }]);
  }
};


  // ----------------------------- REFRESH ---------------------------------
  const onRefresh = async () => {
    setRefresh(true);
    await Promise.all([fetchOrders(), fecthPendingOrders()]);
    setRefresh(false);
  };

  // ----------------------------- EFFECTS ---------------------------------
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const playPause = () => {
    ding.play(success => {
      if (success) {
        playPause();
      }
    });
  };

 

  useEffect(() => {
    const init = async () => {
      const res = await checkLocationPermission();
      if (res) {
        getLatAndLong();
        const locInterval = setInterval(() => getLatAndLong(), 120000);
        return () => clearInterval(locInterval);
      } else {
        setModalVisible(true);
      }
    };
    init();
  }, []);

  // ----------------------------- UI ---------------------------------
  const segmentLabels = useMemo(
    () => [
      <Text>
        UNPICKED ORDERS{' '}
        {/* <Text style={{color: '#D3178A'}}>({allPendingOrders?.length || 0})</Text> */}
      </Text>,
      <Text>
        PICKED ORDERS{' '}
        {/* <Text style={{color: '#D3178A'}}>({accepteddOrders?.length || 0})</Text> */}
      </Text>,
      <Text>
        MY ORDERS{' '}
        {/* <Text style={{color: '#D3178A'}}>({deliveredOrders?.length || 0})</Text> */}
      </Text>,
    ],
    [allPendingOrders, accepteddOrders, deliveredOrders],
  );

  const selectedOrderCount =
  insignSelectedIndex === 0
    ? allPendingOrders?.length || 0
    : insignSelectedIndex === 1
    ? accepteddOrders?.length || 0
    : insignSelectedIndex === 2
    ? deliveredOrders?.length || 0
    : 0;


  return (
    <SafeAreaView style={[styles.container, isDarkTheme && styles.dark_container]}>
      <LocationPermissionModal modalVisible={modalVisible} dismissModal={() => setModalVisible(false)} />

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

      <ScrollView contentContainerStyle={{paddingBottom: 30}}>
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

        <OrdersCard
          orderRequests={
            insignSelectedIndex === 0
              ? allPendingOrders
              : insignSelectedIndex === 1
              ? accepteddOrders
              : insignSelectedIndex === 2
              ? deliveredOrders
              : []
          }
          onOrderPress={item => handleOrderPress(item)}
        />

        <View style={{height: 100}} />
      </ScrollView>
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

