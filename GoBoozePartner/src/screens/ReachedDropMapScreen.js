import {
  View,
  StyleSheet,
  Image,
  Text,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React,{useEffect,useState} from 'react';
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
import NewSlideButton from '../components/NewSlideButton';
import updateOrder from '../constants/statusUpdate';
import Nav from '../assets/Navi.svg'
import { Marker } from 'react-native-svg';
import MapViewDirections from 'react-native-maps-directions';
import Shop from '../assets/Shop.svg'
import Geolocation from '@react-native-community/geolocation';
import UserPin from '../assets/UserPin.svg'
import { useSelector } from 'react-redux';
const ReachedDropMapScreen = ({route}) => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCtTH8DV1-h4tYTSb-geYjdn71a0Up_63k';
  const {currentLattitude, currentLongitude} = useSelector(
    state => state.location,
  );

  const OrderDetails = route.params.orderDetails;
  
console.log(OrderDetails,'OrderDetails===========><====')
  

// Use orders.length or check for specific properties inside orders to safely access data

 

  // const orders = OrderDetails.order && OrderDetails.order.order_Variants ? OrderDetails.order.order_Variants : [];
  // const ordersAddress = OrderDetails.order.address;
  const storeDetails = OrderDetails.order.store;

  
  const insets = useSafeAreaInsets();
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
      Math.cos(toRadians(startLat)) * Math.cos(toRadians(endLat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance.toFixed(2); // Return distance rounded to 2 decimal places
  };

  const toRadians = (angle) => {
    return angle * (Math.PI / 180);
  };
  const calculateTravelTime = (distanceInKm) => {
    const averageSpeed = 40; // Average speed assumed in km/h
    const travelTimeHours = distanceInKm / averageSpeed;
    const travelTimeMinutes = travelTimeHours * 60;
    return Math.round(travelTimeMinutes); // Round to nearest whole number
  };

  const handleUpdateOrder = async () => {
    try {
      await updateOrder(OrderDetails.order_id, 'ready-for-delivery');
    } catch (e) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };
  ;

        
  
  const storeLocation = {
    latitude: storeDetails.location.coordinates[1],
    longitude: storeDetails.location.coordinates[0],
  };
  // Assuming OrderDetails is your variable containing the order details JSON
 

  return (
    <View style={[styles.container, isDarkTheme && styles.dark_container]}>
      <View style={{marginTop: insets.top}}>
        <NavBarWithBackButton title={'Reach Drop'} />
      </View>
      {/* <View
        style={{
          height: '50%',
          // backgroundColor: 'lightblue',
          marginTop: 10,
        }}> */}
   
       {/* <MapView
        provider={PROVIDER_DEFAULT} // remove if not using Google Maps
        style={styles.map}
        region={{
          // latitude: storeDetails
          //   ? storeDetails.location.coordinates[1]
          //   : -37.8057853,
          // longitude: storeDetails
          //   ? storeDetails.location.coordinates[0]
          //   : 144.9479622,
          // latitudeDelta: 0.0121,
          // longitudeDelta: 0.0121,
         
           latitude: -37.840935,
            // ? currentLocation.latitude
            // ? -37.5939222
            // : -37.8057853,
          longitude:144.9102342,
            // ? currentLocation.longitude
            // ?144.9102342
            // : 144.9479622,
          latitudeDelta: 0.0121,
          longitudeDelta: 0.0121,
          
        }}>
            {currentLocation && (
    <Marker coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }}>
     <Shop/>
    </Marker>
    
  )}
        <MapMarker coordinate={storeLocation}>

<UserPin/>
        </MapMarker>
        <MapMarker coordinate={{latitude:-37.840935,
      longitude:144.9102342}}>
<Nav/>
        </MapMarker>
        {true &&
        <MapViewDirections
    origin={{  
      latitude:-37.840935,
      longitude:144.9102342
    //   latitude: currentLocation
    //   ? currentLocation.latitude
    //   : -37.8057853,
    // longitude: currentLocation
    //   ? currentLocation.longitude
    //   : 144.9479622,
    }}
    destination={storeLocation}
    apikey={GOOGLE_MAPS_APIKEY}
       strokeWidth={3}
    strokeColor="hotpink"
  />}

      </MapView> */}
     {/* <MapView
  provider={PROVIDER_DEFAULT}
  style={styles.map}
  region={{
    latitude: -37.840935,
    longitude: 144.9102342,
    latitudeDelta: 0.0121,
    longitudeDelta: 0.0121,
  }}
>
 
  {currentLocation && (
    <Marker coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }}>
 
    </Marker>
  )}

 
  
  <Marker coordinate={{ latitude: -37.840935, longitude: 144.9102342 }}>
  <Nav/>
  </Marker>

  {storeLocation && ( 
    <>
    <Marker coordinate={{ latitude: storeLocation.latitude, longitude: storeLocation.longitude }}>
    <UserPin/>
    </Marker> 
   
    <MapViewDirections
      origin={{ latitude: -37.840935, longitude: 144.9102342 }}
      destination={{
        latitude: storeLocation.latitude,
        longitude: storeLocation.longitude,
      }}
      apikey={GOOGLE_MAPS_APIKEY}
      strokeWidth={3}
      strokeColor="hotpink"
    />
    </>
  )}
</MapView> */}

<MapView
        provider={PROVIDER_DEFAULT} // remove if not using Google Maps
        style={styles.map}
        region={{
          // latitude: storeDetails
          //   ? storeDetails.location.coordinates[1]
          //   : -37.8057853,
          // longitude: storeDetails
          //   ? storeDetails.location.coordinates[0]
          //   : 144.9479622,
          // latitudeDelta: 0.0121,
          // longitudeDelta: 0.0121,
         
           latitude: -37.840935,
            // ? currentLocation.latitude
            // ? -37.5939222
            // : -37.8057853,
          longitude:144.9102342,
            // ? currentLocation.longitude
            // ?144.9102342
            // : 144.9479622,
          latitudeDelta: 0.0121,
          longitudeDelta: 0.0121,
          
        }}>
          
          {/* {currentLattitude && currentLongitude && (
          <Marker coordinate={{ latitude: currentLattitude, longitude: currentLongitude }}>
            <Nav />
          </Marker>
        )} */}
    
 
        <MapMarker coordinate={storeLocation}>
<UserPin/>
        </MapMarker>
        <MapMarker coordinate={{latitude:-37.840935,
      longitude:144.9102342}}>
<Nav/>
        </MapMarker>
      
        {true &&
        <MapViewDirections
    origin={{  
      latitude:-37.840935,
      longitude:144.9102342
    //   latitude: currentLocation
    //   ? currentLocation.latitude
    //   : -37.8057853,
    // longitude: currentLocation
    //   ? currentLocation.longitude
    //   : 144.9479622,
    }}
    destination={storeLocation}
    apikey={GOOGLE_MAPS_APIKEY}
       strokeWidth={3}
    strokeColor="hotpink"
  />}

      </MapView>
      
      {/* </View> */}

      {/* ---------------- BOTTOM CONTAINER ---------------- */}
      <View style={[styles.bottomContainer, darkBg]}>
        <View
          style={[
            styles.topSeperator,
            isDarkTheme && {backgroundColor: '#FFFFFF80'},
          ]}
        />
       <Text style={[styles.kmText, isDarkTheme && {color: '#099A6A'}]}>
        {`${calculateTravelTime(calculateDistance(-37.840935, 144.9102342, storeLocation.latitude, storeLocation.longitude))} min`}
          <Text style={[{color: COLORS.light_primary_text}, darkTextStyle]}>
           ( {`${calculateDistance(-37.840935, 144.9102342, storeLocation.latitude, storeLocation.longitude)} km`})
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
                  {OrderDetails.order.address.first_name}
                  {OrderDetails.order.address.last_name}
                </Text>
                <Text style={[styles.ultralightBlackText, darkTextStyle]}>
                  {OrderDetails.order.address.state}
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
            <View
              style={[
                styles.addressBottomView,
                isDarkTheme && styles.addressBottomViewDark,
              ]}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    `tel:${OrderDetails.order.address.addressPhoneNumber}`,
                  );
                }}
                style={styles.callContainer}>
                <Image
                  tintColor={isDarkTheme && COLORS.pink_light}
                  resizeMode="contain"
                  style={styles.callImg}
                  source={IMAGES.CALL}
                />
                <Text
                  style={[
                    styles.callText,
                    isDarkTheme && {color: COLORS.pink_light},
                  ]}>
                  Call
                </Text>
              </TouchableOpacity>
            </View>
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
            value={`${OrderDetails.order.address.first_name} ${OrderDetails.order.address.last_name}`}
          />
        </View>

        {/* ------------- Bottom slide button ----------- */}
        {/* <CustomSlideButton
          hideSeperator={true}
          title="reached-pickup-location"
          confirmedText="Placing your order"
          onReachedToEnd={() => props.navigation.navigate('OrderPick')}
        /> */}
        <NewSlideButton
          title={'ready-for-delivery'}
          navigationScreen={'CollectMoney'}
          onComplete={handleUpdateOrder}
          orderData={OrderDetails}

          // onComplete={() => {
          //   navigation.navigate('ReachDrop');
          // }}
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
    // height: '50%',
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
  addressBottomView: {
    backgroundColor: '#FDF1F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopColor: COLORS.ligth_grey,
  },
  addressBottomViewDark: {
    backgroundColor: COLORS.dark_theme_background,
    borderTopColor: COLORS.dark_disabled_background,
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
  callContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callImg: {
    width: rWidth(22),
    height: rHeight(22),
  },
  callText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
    paddingVertical: 15,
    paddingLeft: 5,
    color: COLORS.primary_pink,
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

export default ReachedDropMapScreen;
