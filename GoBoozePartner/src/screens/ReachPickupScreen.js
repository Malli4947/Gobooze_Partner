import {
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import COLORS from '../constants/Colors';
import {rHeight, rWidth} from '../constants/PixelSize';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import NavBarWithBackButton from '../components/NavBarWithBackButton';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomSlideButton from '../components/SlideButton/CustomSlideButton';
import {CONST_STYLES} from '../constants/ConstStyles';
import DetailsView from '../components/DetailsView';
import MapView, {MapMarker, PROVIDER_DEFAULT} from 'react-native-maps';
import CallButton from '../components/CallButton';
import NewSlideButton from '../components/NewSlideButton';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import {MAIN_BASE_URL} from '../constants/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Nav from '../assets/Navi.svg';
import {Marker} from 'react-native-svg';
import MapViewDirections from 'react-native-maps-directions';
import Shop from '../assets/Shop.svg';
import {useSelector, useDispatch} from 'react-redux';
const ReachPickupScreen = ({route}) => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCtTH8DV1-h4tYTSb-geYjdn71a0Up_63k';
  const {currentLattitude, currentLongitude} = useSelector(
    state => state.location,
  );
  console.log(
    currentLattitude,
    'currentLattitude================><=============',
  );
  console.log(
    currentLongitude,
    'currentLongitude================><=============',
  );
  const OrderDetails = route.params.orderDetails;
  console.log(OrderDetails, 'OrderDetails================><=============');

  // const storeDetails = route.params.orderDetails.order.store;
  const storeDetails = route.params.orderDetails?.order?.store || {};
  console.log(storeDetails, 'storeDetails');

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkBg = isDarkTheme && {backgroundColor: COLORS.dark_con};
  const darkTextStyle = isDarkTheme && {color: COLORS.dark_primary_text};
  const darkSeperator = isDarkTheme && {
    borderColor: COLORS.dark_disabled_background,
  };
  const calculateDistance = (startLat, startLng, endLat, endLng) => {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(endLat - startLat);
    const dLng = toRadians(endLng - startLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(startLat)) *
        Math.cos(toRadians(endLat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance.toFixed(2); // Return distance rounded to 2 decimal places
  };

  const toRadians = angle => {
    return angle * (Math.PI / 180);
  };
  const calculateTravelTime = distanceInKm => {
    const averageSpeed = 40; // Average speed assumed in km/h
    const travelTimeHours = distanceInKm / averageSpeed;
    const travelTimeMinutes = travelTimeHours * 60;
    return Math.round(travelTimeMinutes); // Round to nearest whole number
  };
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup the event listener
  }, [navigation]);
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
    } catch (e) {}
  };
  const handleOpenNow = () => {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&origin=${currentLattitude},${currentLongitude}&destination=${storeDetails?.location?.coordinates?.[0]},${storeDetails?.location?.coordinates?.[1]}&travelmode=driving`,
    ).catch(err => console.error('An error occurred', err));
  };
  const storeLocation = {
    latitude: storeDetails?.location?.coordinates?.[0],
    longitude: storeDetails?.location?.coordinates?.[1],
  };
  console.log(storeLocation, 'storeLocation=====================');
  return (
    <SafeAreaView
      style={[styles.container, isDarkTheme && styles.dark_container]}>
      <View style={{marginTop: insets.top}}>
        {/* <NavBarWithBackButton
          onPress={() => {
            console.log('000');
            navigation.goBack();
          }}
          title={'Reach Pickup'}
        /> */}
        <View style={styles.header}>
          <Text
            style={[
              styles.headerText,
              isDarkTheme && {
                backgroundColor: '#23272F',
                color: COLORS.light_con,
              },
            ]}>
            Reach Pickup
          </Text>
        </View>
      </View>

      <MapView
        provider={PROVIDER_DEFAULT} // remove if not using Google Maps
        style={styles.map}
        showsTraffic={false}
        region={{
          latitude: currentLattitude,

          longitude: currentLongitude,

          latitudeDelta: 0.0121,
          longitudeDelta: 0.0121,
        }}>
        {currentLattitude && currentLongitude && (
          <MapMarker
            coordinate={{
              latitude: currentLattitude,
              longitude: currentLongitude,
            }}>
            <Nav />
          </MapMarker>
        )}
        <MapMarker coordinate={storeLocation}>
          <Shop />
        </MapMarker>

        {true && (
        
          <MapViewDirections
  origin={{
    latitude: currentLattitude,
    longitude: currentLongitude,
  }}
  destination={storeLocation}
  apikey={GOOGLE_MAPS_APIKEY}
  strokeWidth={3}
  strokeColor="hotpink"
/>
        )}
      </MapView>

      {/* ---------------- BOTTOM CONTAINER ---------------- */}
      <View style={[styles.bottomContainer, darkBg]}>
        <View
          style={[
            styles.topSeperator,
            isDarkTheme && {backgroundColor: '#FFFFFF80'},
          ]}
        />
        <Text style={[styles.kmText, isDarkTheme && {color: '#099A6A'}]}>
          {`${calculateTravelTime(
            calculateDistance(
              currentLattitude,
              currentLongitude,
              storeLocation.latitude,
              storeLocation.longitude,
            ),
          )} min`}
          <Text style={[{color: COLORS.light_primary_text}, darkTextStyle]}>
            ({' '}
            {`${calculateDistance(
              currentLattitude,
              currentLongitude,
              storeLocation.latitude,
              storeLocation.longitude,
            )} km`}
            )
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
              <Pressable
                style={styles.logoImgView}
                onPress={() => {
                  handleOpenNow();
                }}>
                <Image
                  resizeMode="contain"
                  style={styles.logoImg}
                  source={IMAGES.LOC_IMG}
                />
                <View style={styles.viewText}>
                  <Text style={[styles.imgViewTxt]}>View</Text>
                </View>
              </Pressable>
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
            value={OrderDetails.order.sequence_number}
          />
          <DetailsView
            id="1"
            image={IMAGES.CUSTOMER}
            title={'Customer:'}
            value={OrderDetails.order.address.first_name}
          />
        </View>

        <NewSlideButton
          title={'reached-pickup-location'}
          navigationScreen={'OrderPick'}
          onComplete={updateOrder}
          orderData={OrderDetails}
        />
      </View>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: rWidth(16),
    borderBottomColor: COLORS.light_disabled_background,
    borderBottomWidth: 1,
    paddingBottom: rHeight(16),
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
  menuContainer: {
    width: rHeight(44),
    height: rHeight(44),
    borderRadius: rHeight(22),
    borderColor: COLORS.ligth_grey,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuImg: {
    width: rHeight(30),
    height: rHeight(30),
  },
  headerText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    color: '#000',
    paddingLeft: rWidth(16),
    fontSize: rWidth(14),
  },
});

export default ReachPickupScreen;
