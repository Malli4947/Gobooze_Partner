import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import COLORS from '../constants/Colors';
import { useColorScheme } from './ColorSchemeContext';
import { IMAGES } from '../constants/Constant';
import { rHeight, rWidth } from '../constants/PixelSize';
import GBSegmentControl from './GBSegmentControl';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GRAPHIK_FONT } from '../constants/Constant';

const screenWidth = Dimensions.get('screen').width * 0.6;

const OrderNavigationBar = ({}) => {
  const navigation = useNavigation();
  const [onlineOfflineIndex, setOnlineOfflineIndex] = useState(0);
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const [acceptedOrders, setAcceptedOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      const [accessToken, userId] = combinedData?.split(':') ?? [];

      const activeOrdersResponse = await axios.post(
        `https://devapigobooze.codefactstech.com/order/api/orders/get-delivery-user-ongoing-orders/${userId}`,
        {},
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );

      setAcceptedOrders(activeOrdersResponse.data.data.reverse());
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
      const interval = setInterval(() => {
        fetchOrders();
      }, 60000);
      return () => clearInterval(interval);
    }, [fetchOrders])
  );

  useEffect(() => {
    if (acceptedOrders.length > 0) {
      setOnlineOfflineIndex(0); // Force to Online if there are active orders
    }
  }, [acceptedOrders]);

  const handleActivation = async (isActive) => {
    const combinedData = await AsyncStorage.getItem('USER_DATA');
    const [accessToken, userId] = combinedData?.split(':') ?? [];
    try {
      const obj = { is_active: isActive };
      await axios.patch(
        `https://devapigobooze.codefactstech.com/admin/api/partner/update-partner-profile/${userId}`,
        obj,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Error updating:', error.response || error.message || error);
    }
  };

  const handleValueChange = (index) => {
    if (index === 1 && acceptedOrders.length > 0) {
      Alert.alert(
        'Active Orders',
        'You have active orders. Please complete them before going offline.'
      );
      return;
    }
    setOnlineOfflineIndex(index);
    const isActive = index === 0;
    handleActivation(isActive);
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={[
          styles.menuContainer,
          isDarkTheme && {
            backgroundColor: '#23272F',
            borderColor: COLORS.dark_disabled_background,
          },
        ]}
        onPress={() => {
          navigation.navigate('ProfileScreen');
        }}>
        <Image
          tintColor={isDarkTheme ? '#FFF' : undefined}
          resizeMode="contain"
          source={IMAGES.MENU}
          style={styles.menuImg}
        />
      </TouchableOpacity>

      <View style={{ width: rWidth(35) }} />

      <GBSegmentControl
        width={screenWidth}
        tintColor={onlineOfflineIndex === 0 ? '#099A6A' : COLORS.red_error}
        segmentArray={['Online', 'Offline']}
        selectedIndex={onlineOfflineIndex}
        onValueChange={handleValueChange}
        disabledSegments={acceptedOrders.length > 0 ? [1] : []}
      />
    </View>
  );
};

export default OrderNavigationBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: rWidth(15),
  },
  menuContainer: {
    width: rHeight(50),
    height: rHeight(50),
    borderRadius: rHeight(25),
    borderColor: COLORS.ligth_grey,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuImg: {
    width: rHeight(22),
    height: rHeight(22),
  },
  badgeView: {
    width: rHeight(20),
    height: rHeight(20),
    borderRadius: rHeight(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.red_error,
    position: 'absolute',
    top: -5,
    right: -8,
  },
  badgeText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(10),
    color: '#FFF',
  },
});
