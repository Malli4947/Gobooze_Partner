import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  TouchableNativeFeedback,
  Pressable,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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

import Song from '../assets/BearSound.mp3';
import OrdersCard from '../components/OrdersCard';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {pendingOrders} from '../redux/GoboozeApi';
var Sound = require('react-native-sound');

Sound.setCategory('Playback');

var ding = new Sound(Song, Sound.MAIN_BUNDLE, error => {
  if (error) {
    return;
  }
});
const screenWidth = Dimensions.get('screen').width - 30;

const NewHomeScreen = props => {
  const navigation = useNavigation();
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const colorScheme = useColorScheme();

  const [insignSelectedIndex, setInsightSelectedIndex] = useState(0);

  const [listOfRequests, setListOfRequests] = useState([]);
  const [deliveredOrders, setDeliveriedOrders] = useState([]);
  const [accepteddOrders, setAcceptedOrders] = useState([]);
  const [modalData, setModaldata] = useState([]);
  const [allPendingOrders, setAllpendingOrders] = useState([]);

  const previousLengthRef = useRef(0);

  const socket = io('https://devapigobooze.codefactstech.com');

  const isDarkTheme = colorScheme === 'dark';
  const darkSeperator = isDarkTheme && {
    backgroundColor: COLORS.dark_theme_background,
  };

  //   --
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
      }, 6000);

      return () => clearInterval(interval);
    }, []),
  );

  const fecthPendingOrders = async () => {
    try {
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      const [accessToken, userId] = combinedData?.split(':') ?? [];

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
    } catch (e) {}
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
        `https://devapigobooze.codefactstech.com/order/api/orders/get-delivery-user-unassigned-orders/${userId} `,
      );

      console.log(
        '💕 ~ file: NewHomeScreen.js:161 ~ fetchOrders ~ allPendingResponse:',
        allPendingResponse,
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

  // const fetchDelivered = async () => {
  //   try {
  //     const combinedData = await AsyncStorage.getItem('USER_DATA');
  //     const [accessToken, userId] = combinedData?.split(':') ?? [];

  //     const checkingPendingOrders = await axios.post(
  //       `https://devapigobooze.codefactstech.com/order/api/orders/get-delivery-user-order-by-status/${userId}`,
  //       {
  //         order_status: 'delivered',
  //       },
  //       {
  //         headers: {
  //           Authorization: `${accessToken}`,
  //         },
  //       },
  //     );

  //     setDeliveriedOrders(checkingPendingOrders.data.data.reverse());

  //     return;
  //   } catch (e) {}
  // };

  // const activeOrders = async () => {
  //   try {
  //     const combinedData = await AsyncStorage.getItem('USER_DATA');
  //     const [accessToken, userId] = combinedData?.split(':') ?? [];

  //     const checkingActiveOrders = await axios.post(
  //       `https://devapigobooze.codefactstech.com/order/api/orders/get-delivery-user-ongoing-orders/${userId}`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `${accessToken}`,
  //         },
  //       },
  //     );

  //     setAcceptedOrders(checkingActiveOrders.data.data.reverse());

  //     return;
  //   } catch (e) {}
  // };

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
    <View style={[styles.container, isDarkTheme && styles.dark_container]}>
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
    </View>
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
