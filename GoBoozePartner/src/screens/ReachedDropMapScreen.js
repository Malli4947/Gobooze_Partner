import {
  View,
  StyleSheet,
  Image,
  Text,
  Alert,
  TouchableOpacity,
  Linking,
  Pressable,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import COLORS from '../constants/Colors';
import CustomButton from '../components/CustomButton';
import {rHeight, rWidth} from '../constants/PixelSize';
import axios from 'axios';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import NavBarWithBackButton from '../components/NavBarWithBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CONST_STYLES} from '../constants/ConstStyles';
import DetailsView from '../components/DetailsView';
import MapView, {MapMarker, PROVIDER_DEFAULT} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import updateOrder from '../constants/statusUpdate';
import Nav from '../assets/Navi.svg';
import MapViewDirections from 'react-native-maps-directions';
import UserPin from '../assets/UserPin.svg';
import {useSelector} from 'react-redux';
import {BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BackA from '../assets/BackA.svg';
import RightA from '../assets/RightA.svg';
const ReachedDropMapScreen = ({route}) => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCtTH8DV1-h4tYTSb-geYjdn71a0Up_63k';
  const {currentLattitude, currentLongitude} = useSelector(
    state => state.location,
  );
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const navigation = useNavigation();
  const orderData = route.params.orderData;
  const storeDetails = orderData?.order?.store;

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkBg = isDarkTheme && {backgroundColor: COLORS.dark_con};
  const darkTextStyle = isDarkTheme && {color: COLORS.dark_primary_text};
  const darkSeperator = isDarkTheme && {
    borderColor: COLORS.dark_disabled_background,
  };
  const calculateDistance = (startLat, startLng, endLat, endLng) => {
    const earthRadius = 6371;
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
    return distance.toFixed(2);
  };

  const toRadians = angle => {
    return angle * (Math.PI / 180);
  };
  const calculateTravelTime = distanceInKm => {
    const averageSpeed = 40; 
    const travelTimeHours = distanceInKm / averageSpeed;
    const travelTimeMinutes = travelTimeHours * 60;
    return Math.round(travelTimeMinutes); 
  };

  const handleUpdateOrder = async () => {
    try {
      await updateOrder(orderData.order_id, 'ready-for-delivery');
    } catch (e) {
      Alert.alert('Error', 'Failed to update order status');
    }
    navigation.navigate('CollectMoney', {orderData})
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

    return () => backHandler.remove(); 
  }, [navigation]);

  const handleOpenNow = () => {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&origin=${currentLattitude},${currentLongitude}&destination=${orderData.order.address.coordinates.lat},${orderData.order.address.coordinates.lng}&travelmode=driving`,
    ).catch(err => console.error('An error occurred', err));
  };

  const userLocation = {
    latitude: orderData?.order?.address?.coordinates?.lat,
    longitude: orderData?.order?.address?.coordinates?.lng,
  };

const confirmCancelOrder = (orderId) => {
  Alert.alert('Alert!', 'Are you sure you want to drop order?', [
    {
      text: 'No',
      style: 'cancel',
    },
    {
      text: 'Yes',
      onPress: () => CancelOrder(orderId),
    },
  ]);
};

const CancelOrder = async (orderId) => {
  try {
    const combinedData = await AsyncStorage.getItem('USER_DATA');
    if (!combinedData) {
      Alert.alert('Error', 'User not logged in');
      return;
    }
    const [accessToken, userId] = combinedData.split(':') ?? [];
    const response = await axios.post(
      `https://gobooze-test.codefactstech.com/order/api/orders/drop-order/${orderId}/${userId}`,
      {},
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    );
    const resData = response.data;
    if (resData?.success) {
      Alert.alert('Success', resData.message || 'Order cancelled successfully');
      navigation.goBack();
    } else {
      Alert.alert('Failed', resData?.message || 'Could not drop order');
    }
  } catch (error) {
    console.error('Cancel error:', error.response?.data || error.message);
    const backendMessage = error.response?.data?.message || 'Something went wrong while cancelling the order';
    Alert.alert('Error', backendMessage);
  }
};

  return (
    <SafeAreaView
      style={[styles.container, isDarkTheme && styles.dark_container]}>
      <View style={{marginTop: insets.top, marginTop: 0}}>
        <NavBarWithBackButton
          backDisabled={true}
          onPress={() => {
            navigation.navigate('Home');
          }}
          title={'Order has been Picked'}
        />
      </View>

      {currentLattitude && currentLongitude && (
        <MapView
          provider={PROVIDER_DEFAULT} 
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
          <MapMarker coordinate={userLocation}>
            <UserPin />
          </MapMarker>

          {true && (
            <MapViewDirections
              origin={{
                latitude: currentLattitude,
                longitude: currentLongitude,
              }}
              destination={userLocation}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="hotpink"
            />
          )}
        </MapView>
      )}
      <View style={[styles.bottomContainer, darkBg,{marginBottom:rHeight(48)}]}>
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
              userLocation.latitude,
              userLocation.longitude,
            ),
          )} min`} {' '}
          <Text style={[{color: COLORS.light_primary_text}, darkTextStyle]}>
            ({''}
            {`${calculateDistance(
              currentLattitude,
              currentLongitude,
              userLocation.latitude,
              userLocation.longitude,
            )} km`}
            )
          </Text>
        </Text>
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
                  {orderData?.order?.address?.first_name}
                  {orderData?.order?.address?.last_name}
                </Text>
                <Text style={[styles.ultralightBlackText, darkTextStyle]}>
                  {orderData?.order?.address?.address}
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
            <View
              style={[
                styles.addressBottomView,
                isDarkTheme && styles.addressBottomViewDark,
              ]}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    `tel:${orderData?.order?.user?.phoneNumber}`,
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
        <View style={{marginHorizontal: rWidth(23), marginTop: 10}}>
          <DetailsView
            id="0"
            image={IMAGES.BOX}
            title={'Order:'}
            value={orderData?.order?.sequence_number}
          />
          <DetailsView
            style={{width: '60%'}}
            id="1"
            image={IMAGES.CUSTOMER}
            title={'Customer Details:'}
            value={`${orderData?.order?.address?.first_name} ${orderData?.order?.address?.last_name}, ${orderData?.order?.address?.address}`}
          
          />
          <DetailsView
            style={{width: '70%',color:'#D3178A'}}
            id="2"
            image={IMAGES.BOX}
            title={'Instructions :'}
            value={`${orderData?.order?.comments || '----'}`}
            valueStyle={{ color: '#D3178A' }}
          />
        </View>
        <View style={styles.flexBtn}>
          <TouchableOpacity
            style={styles.btnNo}
            onPress={() => navigation.goBack()}>
            <BackA />
            <Text style={[styles.no, isDarkTheme && {color: '#fff'}]}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnNo1} onPress={handleUpdateOrder}>
            <Text style={styles.yes}>Yes</Text>
            <RightA />
          </TouchableOpacity>
        </View>
       
      </View>
<View style={{position:'absolute',bottom:12,width:'100%',paddingHorizontal:rWidth(16),}}>
 <CustomButton
          buttonText="Drop Order"
          
          handleClick={() => confirmCancelOrder(orderData?.order?._id)}
          buttonStyle={[
            {
              backgroundColor:  '#D3178A',
              color:'#FFF'
            },
          ]}
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
    height: '60%',
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
    bottom: 20,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
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
    fontSize: rHeight(16),
    lineHeight: 21,
    fontWeight:'bold',
    color: COLORS.light_primary_text,
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
    no: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(12),
    color: '#000',
    alignSelf: 'center',
  },
  yes: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(12),
    color: '#FFF',
    alignSelf: 'center',
  },
  btnNo: {
    borderWidth: 1,
    borderColor: '#D3178A',
    paddingVertical: rHeight(8),
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rWidth(30),
    marginRight: rWidth(8),
  },
  btnNo1: {
    paddingVertical: rHeight(8),
    borderRadius: 16,
    backgroundColor: '#D3178A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rWidth(30),
    borderWidth: 1,
    borderColor: '#D3178A',
    marginLeft: rWidth(8),
  },
  flexBtn: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingTop: rHeight(16),
    paddingBottom: rHeight(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReachedDropMapScreen;


