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

  const [listOfRequests, setListOfRequests] = useState([]);
  const [deliveredOrders, setDeliveriedOrders] = useState([]);
  const [accepteddOrders, setAcceptedOrders] = useState([]);
  const [modalData, setModaldata] = useState([]);
  const [allPendingOrders, setAllpendingOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [render, rerender] = useState(false);
  const previousLengthRef = useRef(0);
  const isFocus = useIsFocused();
  const socket = io('https://devapigobooze.codefactstech.com');

  const isDarkTheme = colorScheme === 'dark';
  const darkSeperator = isDarkTheme && {
    backgroundColor: COLORS.dark_theme_background,
  };

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
  useFocusEffect(
    useCallback(() => {
      setShowNewOrderModal(false);
    }, []),
  );

  const playPause = () => {
    ding.play(success => {
      if (success) {
        playPause();
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
      fecthPendingOrders();

      const interval = setInterval(() => {
        fecthPendingOrders();
        fetchOrders();
      }, 60000);

      return () => clearInterval(interval);
    }, []),
  );
  const checkLocationPermission = async () => {
    console.log('Executing check location permission:');
    console.log(Platform.OS);
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        console.log(granted, 'permission android--');
        return granted;
      } catch (err) {
        // console.warn(err);
        return false;
      }
    } else if (Platform.OS === 'ios') {
      try {
        const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        console.log(status, 'permission ios--');
        return status;
      } catch (err) {
        // console.log(err, 'error');
        return false;
      }
    }
  };
  useEffect(() => {
    console.log('This is focus value: ' + isFocus);
    const getData = async () => {
      fecthPendingOrders();
      fetchOrders();
      const res = await checkLocationPermission();
      console.log('This is res: ');
      console.log(res);

      rerender(!render);
      if (res == true) {
        getLatAndLong();
        const interval = setInterval(() => {
          getLatAndLong();
        }, 120000); // 900000 milliseconds = 15 minutes, 120000 milliseconds = 2 minutes
        return () => clearInterval(interval);
      } else {
        setModalVisible(!res);
        const intervalId = setInterval(async () => {
          console.log('Checking for location permission: ');
          const res2 = await checkLocationPermission();
          if (res2) {
            clearInterval(intervalId);
            console.log('This interval has been cleared: ' + intervalId);
            setModalVisible(false);
          }
        }, 1000);
      }
    };
    getData();
  }, []);

  const getLatAndLong = async () => {
    Geolocation.watchPosition(
      position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        if (lat && long) {
          postDriverLocation(lat, long);
          dispatch(onGettingCoordinates({lattitude: lat, longitude: long}));
        }
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
      console.log(obj, 'obj================');
      const res = await axios.patch(
        `https://devapigobooze.codefactstech.com/order/api/orders/update-driver-location/${userId}`,
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

  const fecthPendingOrders = async () => {
    try {
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      const [accessToken, userId] = combinedData?.split(':') ?? [];
      console.log(userId, '----userId------');
      const checkingPendingOrders = await axios.post(
        `https://devapigobooze.codefactstech.com/order/api/orders/get-delivery-user-order-by-status/${userId}`,
        {
          order_status: 'pending',
        },
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );

      const newData = checkingPendingOrders.data.data.reverse();
      if (newData.length > previousLengthRef.current) {
        playPause();
      }
      previousLengthRef.current = newData.length;

      setListOfRequests(newData);
      setTimeout(() => {
        ding.stop();
      }, 2500);
      return;
    } catch (e) {
      console.log('Got an error: ');
      console.log(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      const [accessToken, userId] = combinedData?.split(':') ?? [];

      // Fetch delivered orders
      const deliveredOrdersResponse = axios.post(
        `https://devapigobooze.codefactstech.com/order/api/orders/get-delivery-user-order-by-status/${userId}`,
        {
          order_status: 'delivered',
        },
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );

      // Fetch active orders
      const activeOrdersResponse = axios.post(
        `https://devapigobooze.codefactstech.com/order/api/orders/get-delivery-user-ongoing-orders/${userId}`,
        {},

        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );

      const allPendingResponse = await axios.get(
        `https://devapigobooze.codefactstech.com/order/api/orders/get-delivery-user-unassigned-orders/${userId}`,
      );

      setAllpendingOrders(allPendingResponse.data.data);

      // Await both API calls
      const [deliveredOrders, activeOrders] = await Promise.all([
        deliveredOrdersResponse,
        activeOrdersResponse,
      ]);

      setDeliveriedOrders(deliveredOrders.data.data.reverse());
      setAcceptedOrders(activeOrders.data.data.reverse());
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  };

  const onRefresh = async () => {
    setRefresh(true);
    await fetchOrders();
    fecthPendingOrders();
    setRefresh(false);
  };
  const handleOrderPress = item => {
    if (insignSelectedIndex === 0 || insignSelectedIndex === 2) {
      setModaldata(item);
      setShowNewOrderModal(true);
    } else if (insignSelectedIndex === 1) {
      const {order_status} = item.order;
      if (order_status === 'accepted') {
        navigation.navigate('ReachPickup', {orderDetails: item});
      } else if (order_status === 'reached-pickup-location') {
        navigation.navigate('OrderPick', {orderDetails: item});
      } else if (order_status === 'on-the-way') {
        navigation.navigate('ReachMapDrop', {orderDetails: item});
      } else if (order_status === 'ready-for-delivery') {
        navigation.navigate('CollectMoney', {orderDetails: item});
      }
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkTheme && styles.dark_container]}>
      <LocationPermissionModal
        modalVisible={modalVisible}
        dismissModal={() => setModalVisible(false)}
      />
      <NewOrderAlertScreen
        modalVisible={showNewOrderModal}
        dismissModal={() => setShowNewOrderModal(!showNewOrderModal)}
        onReachedToEnd={() => props.navigation.navigate('ReachPickup')}
        orderDetails={modalData}
        denyClick={() => {
          setShowNewOrderModal(false);
        }}
      />
      <CustomStatusBar
        backgroundColor={isDarkTheme ? COLORS.dark_con : COLORS.light_con}
      />
      {/* marginTop: insets.top */}
      <View style={{}}>
        <OrderNavigationBar />
        <View style={[styles.seperator, darkSeperator]} />
      </View>
      <ScrollView
        stickyHeaderIndices={[2]}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
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
              title="Active Orders"
              value={`${accepteddOrders.length}`}
            />
            <TotalEarningOrderView
              title="Pending Orders"
              value={allPendingOrders.length}
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
              segmentArray={['Me', 'On Going', 'Pending']}
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
              ? listOfRequests
              : insignSelectedIndex === 1
              ? accepteddOrders
              : insignSelectedIndex === 2
              ? allPendingOrders
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
