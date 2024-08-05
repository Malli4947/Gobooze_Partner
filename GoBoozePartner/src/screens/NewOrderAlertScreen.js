import {BlurView} from '@react-native-community/blur';
import React from 'react';
import {StyleSheet, Text, View, Modal, Image} from 'react-native';
import {useColorScheme} from '../components/ColorSchemeContext';
import EarningPickDropDetailView from '../components/EarningPickDropDetailView';
import ModalCancelButton from '../components/ModalCancelButton';
import CustomSlideButton from '../components/SlideButton/CustomSlideButton';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import NewSlideButton from '../components/NewSlideButton';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

import {API_BASE_URL, MAIN_BASE_URL} from '../constants/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewOrderAlertScreen = props => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const {modalVisible, dismissModal, onReachedToEnd, denyClick, orderDetails} =
    props;

  console.log(
    '💕 ~ file: NewOrderAlertScreen.js:18 ~ NewOrderAlertScreen ~ orderDetails:',
    orderDetails.order_id,
  );

  const navigation = useNavigation();

  const darkTextColor = isDarkTheme && {color: '#FFF'};
  const darkSeperator = isDarkTheme && {
    borderColor: COLORS.dark_disabled_background,
  };
  const darkBg = isDarkTheme && {backgroundColor: COLORS.dark_con};

  const acceptOrder = async () => {
    try {
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      const [accessToken, userId] = combinedData?.split(':') ?? [];
      const acceptRes = await axios.post(
        `${MAIN_BASE_URL}order/api/orders/accept-order?orderId=${orderDetails.order_id}&userId=${userId}`,
        {},
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
      dismissModal();
    } catch (e) {
      console.log('💕 ~ file: NewOrderAlertScreen.js:35 ~ acceptOrder ~ e:', e);
    }
  };

  return (
    <Modal visible={modalVisible} transparent={true} animationType={'fade'}>
      {/* <BlurView
        blurType={'light'}
        blurAmount={3}
        style={styles.mainOuterComponent}> */}
      {orderDetails.length !== 0 && (
        <View
          style={[
            styles.mainOuterComponent,
            isDarkTheme && {backgroundColor: '#31364180'},
          ]}>
          <View style={styles.mainContainer}>
            <ModalCancelButton onPress={dismissModal} />
            <View
              style={[
                styles.bottomContainer,
                isDarkTheme && {backgroundColor: COLORS.dark_theme_background},
              ]}>
              <View
                style={{
                  // flexDirection: 'row',
                  // justifyContent: 'space-between',
                  marginHorizontal: 15,
                  alignItems: 'center',
                }}>
                <View></View>
                <Text style={[styles.newOrderText, darkTextColor]}>
                  New Order!
                </Text>
                {/* <Text onPress={denyClick} style={styles.denyText}>
                  Deny
                </Text> */}
              </View>

              {/* total earning and pick drop kms */}
              {/* <EarningPickDropDetailView
              earning={{key: 'Expected Earning: ', value: '$5.89'}}
              bottomLeft={{key: 'Pickup: ', value: '2.5km'}}
              bottomRight={{key: 'Drop: ', value: '28mins'}}
            /> */}

              {/* Pick up address */}
              <View
                style={[
                  styles.pickupAddressContainer,
                  styles.shadow,
                  darkSeperator,
                  darkBg,
                ]}>
                <View style={styles.pickUpTopView}>
                  <Text style={[styles.darkText, darkTextColor]}>
                    PICKUP FROM
                  </Text>
                  {/* <View style={styles.pickUpTopView}>
                  <Image
                    tintColor={isDarkTheme && COLORS.dark_primary_text}
                    style={styles.clockImg}
                    source={IMAGES.CLOCK}
                  />
                  <Text style={[darkTextColor]}>5min away</Text>
                </View> */}
                </View>
                <View style={styles.pickUpBottomView}>
                  <View style={styles.logoImgView}>
                    <Image
                      resizeMode="contain"
                      style={styles.logoImg}
                      source={IMAGES.GO_LOGO}
                    />
                  </View>
                  <View style={{marginLeft: 10, width: '75%'}}>
                    <Text
                      style={[styles.darkText, {fontSize: 15}, darkTextColor]}>
                      {orderDetails.order.store.storeName}(
                      {orderDetails.order.store.storeNumber})
                    </Text>
                    <Text
                      style={[
                        styles.lightText,
                        styles.addressText,
                        darkTextColor,
                      ]}>
                      {orderDetails.order.store.storeAddress}
                    </Text>
                  </View>
                </View>
              </View>

              <NewSlideButton
                title={'Accept order'}
                navigationScreen={'ReachPickup'}
                onComplete={acceptOrder}
                orderData={orderDetails}
              />
            </View>
          </View>
        </View>
      )}

      {/* </BlurView> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainOuterComponent: {
    flex: 1,
    backgroundColor: '#31364180',
  },
  mainContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: rHeight(30),
  },
  topSeperator: {
    position: 'absolute',
    marginTop: 20,
    width: 50,
    height: 4,
    backgroundColor: '#D1D5DB',
    marginBottom: 30,
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  cancelButtonContainer: {
    width: rWidth(60),
    height: rHeight(60),
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 99,
    backgroundColor: 'black',
  },
  cancelButton: {
    width: rWidth(20),
    height: rHeight(20),
    alignSelf: 'center',
  },
  newOrderText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(22),
    alignSelf: 'center',
    marginLeft: 20,
  },
  denyText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(14),
    color: '#E44956',
  },
  lightText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(17),
    color: COLORS.light_primary_text,
  },
  darkText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(19),
  },
  pickupAddressContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.ligth_grey,
    marginHorizontal: rWidth(20),
    padding: rHeight(20),
    backgroundColor: '#FFF',
    marginTop: rHeight(20),
  },
  pickUpTopView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clockImg: {
    width: rWidth(22),
    height: rHeight(22),
    marginRight: 5,
  },
  pickUpBottomView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: rHeight(15),
    marginHorizontal: 0,
  },
  logoImgView: {
    width: rHeight(60),
    height: rHeight(60),
    borderRadius: rHeight(16),
    backgroundColor: COLORS.primary_pink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    width: rHeight(40),
    height: rHeight(40),
  },
  addressText: {
    fontSize: 13,
    paddingTop: 5,
    lineHeight: 17,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default NewOrderAlertScreen;
