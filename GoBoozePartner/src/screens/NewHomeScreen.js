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
  console.log('deliveredOrderss',deliveredOrders)
  const [accepteddOrders, setAcceptedOrders] = useState([]);
  console.log('acceptedOrderss',accepteddOrders)
  const [modalData, setModaldata] = useState([]);
  const [allPendingOrders, setAllpendingOrders] = useState([]);
  console.log('allPendingOrders',allPendingOrders)
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
        position => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;

          if (lat && long) {
            setCurrentCoordinates({lat, long});
            postDriverLocation(lat, long);
            dispatch(onGettingCoordinates({lattitude: lat, longitude: long}));
            setModalVisible(false);
          }
        },
        error => {
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

  const fetchOrders = async () => {
  const isActive = await checkIsActiveStatus();
  if (!isActive) return;

  try {
    const combinedData = await AsyncStorage.getItem('USER_DATA');
    console.log('comibnedData',combinedData)
    const [accessToken, userId] = combinedData?.split(':') ?? [];
    console.log('accestoken',userId,accessToken)
    

    // --- Delivered Orders ---
    let deliveredOrders = [];
    try {
      const res = await axios.post(
        `https://api.gobooze.com.au/order/api/orders/get-delivery-user-order-by-status/${userId}`,
        { order_status: 'delivered' },
        { headers: { Authorization: `${accessToken}` } }
      );
      deliveredOrders = res.data?.data?.reverse() ?? [];
    } catch (err) {
      console.error("❌ Delivered orders error:", err.response?.data || err.message);
    }

    // --- Active Orders ---
    let activeOrders = [];
    try {
      const res = await axios.post(
        `https://api.gobooze.com.au/order/api/orders/get-delivery-user-ongoing-orders/${userId}`,
        {},
        { headers: { Authorization: `${accessToken}` } }
      );
      activeOrders = res.data?.data?.reverse() ?? [];
    } catch (err) {
      console.error("❌ Active orders error:", err.response?.data || err.message);
    }

    // --- Pending Orders ---
    let pendingOrders = [];
    try {
      const res = await axios.get(
        `https://api.gobooze.com.au/order/api/orders/get-delivery-user-unassigned-orders/${userId}`
      );
      if (res.data?.success && res.data?.data) {
        pendingOrders = res.data.data.reverse();
      } else {
        console.warn("⚠️ No pending orders found");
      }
    } catch (err) {
      if (err.response?.status === 500 && err.response?.data?.message === "No order found") {
        console.warn("⚠️ Pending orders empty (500 response from server)");
        pendingOrders = [];
      } else {
        console.error("❌ Pending orders error:", err.response?.data || err.message);
      }
    }

    // --- Set State ---
    setDeliveriedOrders(deliveredOrders);
    setAcceptedOrders(activeOrders);
    setAllpendingOrders(pendingOrders);

  } catch (e) {
    console.error("❌ fetchOrders general error:", e.message);
  }
};


const handleOrderPress = async (item) => {
  if (showNewOrderModal) return; // Already open — do nothing

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

    if (!currentCoordinates) {
      Alert.alert(
        'Unable to Retrieve Location',
        'Please ensure your location services are enabled and try again.',
        [{ text: 'OK' }]
      );
      return;
    }

    const combinedData = await AsyncStorage.getItem('USER_DATA');
    const [accessToken, userId] = combinedData?.split(':') ?? [];

    const fetchDetails = await fetch(
      `https://api.gobooze.com.au/admin/api/partner/get-partner/${userId}`,
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    );

    const data = await fetchDetails.json();

    if (data.data.is_active === false) {
      Alert.alert(
        'Alert: You are Currently Offline',
        'To accept new orders, Please go Online.',
        [{ text: 'OK' }]
      );
      return;
    }

    // ✅ Open only one modal
    if (insignSelectedIndex === 0 || insignSelectedIndex === 2) {
      setModaldata(item);
      setShowNewOrderModal(true);
    } else if (insignSelectedIndex === 1) {
      navigation.navigate('ReachMapDrop', {
        orderData: item,
      });
    }
  } catch (error) {
    console.error('Error in handleOrderPress:', error);
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
      // console.log(obj, 'obj================');
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
      {/* <SignalStrengthComponent /> */}
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

