import {View, StyleSheet, Image, Text, Linking} from 'react-native';
import React from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import COLORS from '../constants/Colors';
import {rHeight, rWidth} from '../constants/PixelSize';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import NavBarWithBackButton from '../components/NavBarWithBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomSlideButton from '../components/SlideButton/CustomSlideButton';
import {CONST_STYLES} from '../constants/ConstStyles';
import DetailsView from '../components/DetailsView';
import MapView, {MapMarker, PROVIDER_DEFAULT} from 'react-native-maps';
import CallButton from '../components/CallButton';
import NewSlideButton from '../components/NewSlideButton';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

import {MAIN_BASE_URL} from '../constants/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReachPickupScreen = ({route}) => {
  const OrderDetails = route.params.orderDetails;
  console.log(
    '💕 ~ file: ReachPickupScreen.js:23 ~ ReachPickupScreen ~ OrderDetails:',
    OrderDetails,
  );

  const storeDetails = route.params.orderDetails.order.store;
  console.log(
    '💕 ~ file: ReachPickupScreen.js:28 ~ ReachPickupScreen ~ storeDetails:',
    storeDetails,
  );
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkBg = isDarkTheme && {backgroundColor: COLORS.dark_con};
  const darkTextStyle = isDarkTheme && {color: COLORS.dark_primary_text};
  const darkSeperator = isDarkTheme && {
    borderColor: COLORS.dark_disabled_background,
  };
  console.log(
    '💕 ~ file: ReachPickupScreen.js:11 ~ MAIN_BASE_URL:',
    MAIN_BASE_URL,
  );
  const origin = {
    latitude: -37.8057853,
    longitude: 144.9479622,
  };

  const updateOrder = async () => {
    try {
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      const [accessToken, userId] = combinedData?.split(':') ?? [];
      const acceptRes = await axios.patch(
        `${MAIN_BASE_URL}order/api/orders/update-order-status/${OrderDetails.order_id}`,
        {
          order_status: 'reached-pickup-location',
        },
        {
          headers: {
            Authorization: `${accessToken}`, // Include the access token in the headers
          },
        },
      );
      console.log(
        '💕 ~ file: NewOrderAlertScreen.js:49 ~ acceptOrder ~ acceptRes:',
        acceptRes,
      );
    } catch (e) {
      console.log('💕 ~ file: ReachPickupScreen.js:55 ~ updateOrder ~ e:', e);
    }
  };

  return (
    <View style={[styles.container, isDarkTheme && styles.dark_container]}>
      <View style={{marginTop: insets.top}}>
        <NavBarWithBackButton
          onPress={() => {
            console.log('000');
            navigation.goBack();
          }}
          title={'Reach Pickup'}
        />
      </View>

      <MapView
        provider={PROVIDER_DEFAULT} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: storeDetails
            ? storeDetails.location.coordinates[1]
            : -37.8057853,
          longitude: storeDetails
            ? storeDetails.location.coordinates[0]
            : 144.9479622,
          latitudeDelta: 0.0121,
          longitudeDelta: 0.0121,
        }}>
        <MapMarker coordinate={origin}></MapMarker>
      </MapView>
      {/* map view */}

      {/* ---------------- BOTTOM CONTAINER ---------------- */}
      <View style={[styles.bottomContainer, darkBg]}>
        <View
          style={[
            styles.topSeperator,
            isDarkTheme && {backgroundColor: '#FFFFFF80'},
          ]}
        />
        <Text style={[styles.kmText, isDarkTheme && {color: '#099A6A'}]}>
          {`${8} min`}
          <Text style={[{color: COLORS.light_primary_text}, darkTextStyle]}>
            {` (${3.5}km)`}
          </Text>
        </Text>

        {/* ------------- Address view -------------- */}
        <View
          style={[
            styles.pickupAddressContainer,
            CONST_STYLES.shadow,
            darkSeperator,
            darkBg,
          ]}>
          <View style={styles.addressContainer}>
            <View style={styles.addressTopView}>
              <View style={{width: '70%'}}>
                <Text style={[styles.lightBlackText, darkTextStyle]}>
                  {storeDetails.storeName}({storeDetails.storeNumber})
                </Text>
                <Text style={[styles.ultralightBlackText, darkTextStyle]}>
                  {storeDetails.storeAddress}
                </Text>
              </View>
              <View style={styles.logoImgView}>
                <Image
                  resizeMode="contain"
                  style={styles.logoImg}
                  source={IMAGES.LOC_IMG}
                />
                <View style={styles.viewText}>
                  <Text style={[styles.imgViewTxt]}>View</Text>
                </View>
              </View>
            </View>
            <CallButton
              onPress={() => {
                Linking.openURL(`tel:${storeDetails.phone}`);
              }}
            />
          </View>
        </View>

        {/* --------------- ORDER DETAIL VIEW --------------- */}
        <View style={{marginHorizontal: rWidth(23), marginTop: 10}}>
          <DetailsView
            id="0"
            image={IMAGES.BOX}
            title={'Order:'}
            value={`   #${OrderDetails.order_id.slice(
              0,
              5,
            )}-${OrderDetails.order_id.slice(-5)}`}
          />
          <DetailsView
            id="1"
            image={IMAGES.CUSTOMER}
            title={'Customer:'}
            value={OrderDetails.order.address.addressFullName}
          />
        </View>

        <NewSlideButton
          title={'reached-pickup-location'}
          navigationScreen={'OrderPick'}
          onComplete={updateOrder}
          orderData={OrderDetails}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  dark_container: {
    backgroundColor: COLORS.dark_theme_background,
  },
  map: {
    height: '80%',
  },
  logoContainer: {
    marginBottom: 100,
    alignItems: 'center',
  },
  partnerText: {
    marginTop: rHeight(20),
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rHeight(22),
    color: COLORS.primary_pink,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    height: '50%',
  },
  topSeperator: {
    height: 4,
    width: '15%',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: COLORS.light_primary_opacity,
  },
  kmText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(20),
    color: '#08875D',
    marginLeft: rWidth(20),
  },
  pickupAddressContainer: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: COLORS.ligth_grey,
    marginHorizontal: rWidth(20),
    backgroundColor: '#FFF',
    marginTop: rHeight(20),
    overflow: 'hidden',
  },
  addressContainer: {
    overflow: 'hidden',
  },
  addressTopView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: rHeight(15),
  },
  logoImgView: {
    width: rHeight(70),
    height: rHeight(70),
    borderRadius: rHeight(14),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImg: {
    width: rHeight(70),
    height: rHeight(70),
  },
  ultralightBlackText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(12),
    color: COLORS.light_primary_text,
    paddingTop: 5,
    lineHeight: 20,
  },
  lightBlackText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
    lineHeight: 21,
  },
  viewText: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.blue,
    width: '100%',
    height: rHeight(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgViewTxt: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: 11,
    color: '#FFF',
  },
  slideButtonContainer: {
    borderTopWidth: 2,
    borderTopColor: COLORS.ligth_grey,
    marginTop: rHeight(20),
    marginBottom: rHeight(15),
    paddingVertical: rHeight(10),
    paddingHorizontal: rWidth(20),
  },
});

export default ReachPickupScreen;
