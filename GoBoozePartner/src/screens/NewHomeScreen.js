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
import {rHeight} from '../constants/PixelSize';
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
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const [insignSelectedIndex, setInsightSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [listOfRequests, setListOfRequests] = useState([]);
  const [deliveredOrders, setDeliveriedOrders] = useState([]);
  const [accepteddOrders, setAcceptedOrders] = useState([]);
  const [modalData, setModaldata] = useState([]);
  const [allPendingOrders, setAllpendingOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [render, rerender] = useState(false);
  const previousLengthRef = useRef(0);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const isFocus = useIsFocused();
  const [orderAlreadyAccepted, setOrderAlreadyAccepted] = useState(false);
  const socket = io('https://api.gobooze.com.au');

  const isDarkTheme = colorScheme === 'dark';
  const darkSeperator = isDarkTheme && {
    backgroundColor: COLORS.dark_theme_background,
  };

  //malika code starting 15/08
  useEffect(() => {
    // console.log('This is focus executing...');
    onRefresh();
  }, [isFocus]);
  const checkLocationEnabled = async () => {
    const locationEnabled = await checkLocationPermission(); // This function is already implemented in your code
    return locationEnabled;
  };

  //Malike Code ending

  //Malika new changes -> 17-08
  const checkIsActiveStatus = async () => {
    try {
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      const [accessToken, userId] = combinedData?.split(':') ?? [];

      const fetchDetails = await fetch(
        `https://api.gobooze.com.au/admin/api/partner/get-partner/${userId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );
      const data = await fetchDetails.json();

      return data?.data?.is_active ?? false;
    } catch (error) {
      return false; // Return false if there's an error
    }
  };

const getLatAndLong = async () => {
  const isActive = await checkIsActiveStatus();
  if (!isActive) return; // Do not proceed if user is inactive

  try {
    Geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        if (lat && long) {
          const coords = { lat, long };
          setCurrentCoordinates(coords);
          try {
            await AsyncStorage.setItem("LAST_COORDINATES", JSON.stringify(coords));
            console.log("Coordinates saved locally:", coords);
          } catch (err) {
            console.warn("Failed to store coordinates:", err.message);
          }
          postDriverLocation(lat, long);
          dispatch(onGettingCoordinates({ lattitude: lat, longitude: long }));
          setModalVisible(false);
        }
      },
      error => {
        console.warn("Geolocation error:", error.message);
        setModalVisible(true);
        setCurrentCoordinates(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        distanceFilter: 1,
        interval: 1000,
        fastestInterval: 2000,
      },
    );
  } catch (error) {
    console.error("getLatAndLong failed:", error.message);
    setModalVisible(true);
  }
};

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

const mask = (s) => {
  if (!s) return '[missing]';
  if (s.length <= 8) return s;
  return `${s.slice(0,4)}...${s.slice(-4)}`; // safe masking
};

const fetchOrders = async () => {
  const isActive = await checkIsActiveStatus();
  // --- Always load cache first (so UI has something to show) ---
  const cachedDelivered = await AsyncStorage.getItem("CACHED_DELIVERED_ORDERS");
  const cachedActive = await AsyncStorage.getItem("CACHED_ACTIVE_ORDERS");
  const cachedPending = await AsyncStorage.getItem("CACHED_PENDING_ORDERS");
  let deliveredOrders = cachedDelivered ? JSON.parse(cachedDelivered) : [];
  let activeOrders = cachedActive ? JSON.parse(cachedActive) : [];
  let pendingOrders = cachedPending ? JSON.parse(cachedPending) : [];

  // update UI immediately with cache
  setDeliveriedOrders(deliveredOrders);
  setAcceptedOrders(activeOrders);
  setAllpendingOrders(pendingOrders);

  // --- If user is not active, just stop here but keep cache UI ---
  if (!isActive) {
    console.log('User not active → showing cached orders only');
    return;
  }

  try {
    const combinedData = await AsyncStorage.getItem("USER_DATA");
    const [accessToken, userId] = combinedData?.split(":") ?? [];
    try {
      const res = await axios.post(
        `https://api.gobooze.com.au/order/api/orders/get-delivery-user-order-by-status/${userId}`,
        { order_status: "delivered" },
        { headers: { Authorization: `${accessToken}` } }
      );
      const apiData = res.data?.data?.reverse() ?? [];
      if (apiData.length > 0) {
        deliveredOrders = apiData;
        await AsyncStorage.setItem("CACHED_DELIVERED_ORDERS", JSON.stringify(apiData));
      }
    } catch (err) {
      console.warn('Delivered API failed, keeping cache', err?.message);
    }
    // --- Active Orders API ---
    try {
      const res = await axios.post(
        `https://api.gobooze.com.au/order/api/orders/get-delivery-user-ongoing-orders/${userId}`,
        {},
        { headers: { Authorization: `${accessToken}` } }
      );
      const apiData = res.data?.data?.reverse() ?? [];
      if (apiData.length > 0) {
        activeOrders = apiData;
        await AsyncStorage.setItem("CACHED_ACTIVE_ORDERS", JSON.stringify(apiData));
      }
    } catch (err) {
      console.warn('Active API failed, keeping cache', err?.message);
    }
    // --- Pending Orders API ---
    try {
      const res = await axios.get(
        `https://api.gobooze.com.au/order/api/orders/get-delivery-user-unassigned-orders/${userId}`
      );
      const apiData =
        res.data?.success && res.data?.data ? res.data.data.reverse() : [];
      if (apiData.length > 0) {
        pendingOrders = apiData;
        await AsyncStorage.setItem("CACHED_PENDING_ORDERS", JSON.stringify(apiData));
      }
    } catch (err) {
      console.warn('Pending API failed, keeping cache', err?.message);
    }
    // --- Final UI update ---
    setDeliveriedOrders(deliveredOrders);
    setAcceptedOrders(activeOrders);
    setAllpendingOrders(pendingOrders);
  } catch (e) {
    console.error('fetchOrders general error:', e?.message, e);
  }
};

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

    // --- Use currentCoordinates or fallback to stored coordinates ---
    let coordinates = currentCoordinates;
    if (!coordinates) {
      const savedCoords = await AsyncStorage.getItem("LAST_COORDINATES");
      if (savedCoords) {
        coordinates = JSON.parse(savedCoords);
        setCurrentCoordinates(coordinates);
        dispatch(onGettingCoordinates({ lattitude: coordinates.lat, longitude: coordinates.long }));
      } else {
        Alert.alert(
          'Unable to Retrieve Location',
          'Please ensure your location services are enabled and try again.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    // --- Get accessToken and userId from storage ---
    const combinedData = await AsyncStorage.getItem('USER_DATA');
    const [accessToken, userId] = combinedData?.split(':') ?? [];

    let isActive = true; // default assume active
    try {
      // Try to fetch user status
      const res = await axios.get(
        `https://api.gobooze.com.au/admin/api/partner/get-partner/${userId}`,
        { headers: { Authorization: accessToken } }
      );
      isActive = res.data?.data?.is_active ?? true;
    } catch (err) {
      console.warn(" Network failed, using local status:", err.message);
      // Optionally, you can read a locally cached partner info if you saved it before
      // const cachedPartner = await AsyncStorage.getItem("CACHED_PARTNER_INFO");
      // isActive = cachedPartner ? JSON.parse(cachedPartner).is_active : true;
    }

    if (!isActive) {
      Alert.alert(
        'Alert: You are Currently Offline',
        'To accept new orders, Please go Online.',
        [{ text: 'OK' }]
      );
      return;
    }

    // --- Open modal or navigate ---
    if (insignSelectedIndex === 0 || insignSelectedIndex === 2) {
      setModaldata(item);
      setShowNewOrderModal(true);
    } else if (insignSelectedIndex === 1) {
      navigation.navigate('ReachMapDrop', { orderData: item });
    }

  } catch (error) {
    console.error('Error in handleOrderPress:', error.message);
    Alert.alert('Error', 'Something went wrong. Please try again.', [{ text: 'OK' }]);
  }
};

  //Malika New changes ends
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    ding.setVolume(10);
    return () => {
      ding.release();
    };
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  useFocusEffect(
    useCallback(() => {
      setShowNewOrderModal(false);
      fetchData();
    }, []),
  );

  const playPause = () => {
    ding.play(success => {
      if (success) {
        playPause();
      }
    });
  };
  const fetchData = async () => {
    try {
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      const [accessToken, userId] = combinedData?.split(':') ?? [];

      const response = await axios.get('your_api_endpoint', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Process response data
      const data = response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Access token has expired, navigate to login
        navigation.navigate('Login');
      } else {
        // Handle other errors
        console.error('Error fetching data:', error);
      }
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
      fecthPendingOrders();

      const interval = setInterval(() => {
        fecthPendingOrders();
        fetchOrders();
      }, 5000); 

      return () => clearInterval(interval);
    }, []),
  );
  const checkLocationPermission = async () => {
    // console.log('Executing check location permission:');
    // console.log(Platform.OS);
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        // console.log(granted, 'permission android--');
        return granted;
      } catch (err) {
        // console.warn(err);
        return false;
      }
    } else if (Platform.OS === 'ios') {
      try {
        const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        // console.log(status, 'permission ios--');
        return status;
      } catch (err) {
        // console.log(err, 'error');
        return false;
      }
    }
  };
  useEffect(() => {
    // console.log('This is focus value: ' + isFocus);
    const getData = async () => {
      fecthPendingOrders();
      fetchOrders();
      const res = await checkLocationPermission();
      // console.log('This is res: ');
      // console.log(res);

      rerender(!render);
      if (res == true || res == 'granted') {
        getLatAndLong();
        const interval = setInterval(() => {
          getLatAndLong();
        }, 120000); // 900000 milliseconds = 15 minutes, 120000 milliseconds = 2 minutes
        return () => clearInterval(interval);
      } else {
        setModalVisible(!res);
        const intervalId = setInterval(async () => {
          // console.log('Checking for location permission: ');
          const res2 = await checkLocationPermission();
          if (res2) {
            clearInterval(intervalId);
            // console.log('This interval has been cleared: ' + intervalId);
            setModalVisible(false);
          }
        }, 1000);
      }
    };
    getData();
  }, []);

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
    } catch (error) {
      console.log(error, 'error================');
    }
  };

  const onRefresh = async () => {
    setRefresh(true);
    await fetchOrders();
    fecthPendingOrders();
    setRefresh(false);
  };


  return (
    <SafeAreaView
      style={[styles.container, isDarkTheme && styles.dark_container]}>
      <LocationPermissionModal
        modalVisible={modalVisible}
        dismissModal={() => setModalVisible(false)}
      />
     {/* <NetworkSpeedIndicator isDarkTheme={isDarkTheme} /> */}
      <NewOrderAlertScreen
        orderAlreadyAccepted={orderAlreadyAccepted}
        modalVisible={showNewOrderModal}
        dismissModal={() => setShowNewOrderModal(!showNewOrderModal)}
        onReachedToEnd={() => props.navigation.navigate('ReachPickup')}
        orderDetails={modalData}
        denyClick={() => {
          setShowNewOrderModal(false);
        }}
      />
      {/* <CustomStatusBar
        backgroundColor={isDarkTheme ? COLORS.dark_con : COLORS.light_con}
      /> */}
      {/* marginTop: insets.top */}
      <View style={{}}>
        <OrderNavigationBar />
        <View style={[styles.seperator, darkSeperator]} />
      </View>
      <SignalStrengthComponent />
      <ScrollView
        stickyHeaderIndices={[2]}
        // refreshControl={
        //   <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        // }
        contentContainerStyle={{paddingBottom: 30}}>
        {/* ------------- total arning and order view  ------------- */}
        <View style={styles.horizontalMargin}>
          <Text
            style={[
              styles.totalEarningText,
              isDarkTheme && {color: COLORS.dark_primary_text},
            ]}>
            Orders
          </Text>
          <View style={styles.earningOrderContainer}>
            <TotalEarningOrderView
              title="Orders"
              value={allPendingOrders.length}
            />
            <TotalEarningOrderView
              title="Active Orders"
              value={`${accepteddOrders.length}`}
            />
          </View>
        </View>
        <View style={[styles.seperator, darkSeperator]}></View>

        {/* ------------- total arning and order view  ------------- */}
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
              Orders
            </Text>
            <GBSegmentControl
              width={screenWidth}
              segmentBorderRadius={10}
              inactiveBgColor={isDarkTheme && '#00000070'}
              tintColor={isDarkTheme ? '#3F444D' : '#FFF'}
              inactiveFont={isDarkTheme && '#FFFFFFBF'}
              activeFont={isDarkTheme ? '#FFF' : COLORS.light_primary_text}
              segmentArray={['Orders', 'On Going']}
              selectedIndex={insignSelectedIndex}
              onValueChange={index => {
                // playPause();
                setInsightSelectedIndex(index);
              }}
            />
          </View>
        </View>
        <OrdersCard
          orderRequests={
            insignSelectedIndex === 0
              ? allPendingOrders
              : insignSelectedIndex === 1
              ? accepteddOrders
              : []
          }
          onOrderPress={item => handleOrderPress(item)}
        />

        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    accessToken: state.auth.bearerAccessToken,
    loginUserId: state.auth.loginUserId,
  };
};

const mapDispatchToProps = dispatch => {
  return {appActions: bindActionCreators(appActions, dispatch)};
};

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

