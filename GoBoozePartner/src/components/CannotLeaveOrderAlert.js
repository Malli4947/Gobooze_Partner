import {BlurView} from '@react-native-community/blur';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useColorScheme} from '../components/ColorSchemeContext';
import ModalCancelButton from '../components/ModalCancelButton';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import CustomButton from './CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const options = [
  {id: 0, option: 'Customer request to redeliver'},
  {id: 1, option: 'Absence of customer'},
  {id: 2, option: 'Change In Delivery Address'},
  {id: 3, option: 'Others'},
];

const CannotLeaveOrderAlert = props => {
  const colorScheme = useColorScheme();
  const [reasons, setReasons] = useState(options);
  const isDarkTheme = colorScheme === 'dark';
  const {modalVisible, dismissModal, onGoback, onSuccessCancel, orderId} =
    props;
  // console.log(
  //   '💕 ~ file: CannotLeaveOrderAlert.js:34 ~ CannotLeaveOrderAlert ~ orderId:',
  //   orderId,
  // );

  const darkTextColor = isDarkTheme && {color: '#FFF'};
  const checked = isDarkTheme ? IMAGES.CHECKED_DARK : IMAGES.CHECKED_LIGHT;
  const [selectedOption, setSelectedOption] = useState('');
  const unchecked = isDarkTheme
    ? IMAGES.UNCHECKED_DARK
    : IMAGES.UNCHECKED_LIGHT;

  const itemSelected = index => {
    let tempOptions = [...reasons];
    tempOptions.forEach(option => {
      option.selected = false;
    });
    tempOptions[index].selected = true;
    setReasons(tempOptions);
  };

  const optionSelection = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedOption(item);
        }}
        style={styles.optionContainer}>
        <TouchableOpacity>
          <Image
            style={styles.checkStyle}
            source={selectedOption == item ? checked : unchecked}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.optionText,
            darkTextColor,
            selectedOption == item && {color: 'red'},
          ]}>
          {item.option}
        </Text>
      </TouchableOpacity>
    );
  };

  const cancelOrder = async () => {
    try {
      if (selectedOption == '') {
        Alert.alert('', 'Please Select Reason Before Cancelling the Order');
      }
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      const [accessToken, userId] = combinedData?.split(':') ?? [];
      const orderCancelRes = await axios.patch(
        `https://gobooze-test.codefactstech.com/order/api/orders/update-order-status/${orderId}`,
        {
          order_status: 'cancelled',
          cancel_reason: `${selectedOption}`,
        },
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );

      // console.log(
      //   '💕 ~ file: CannotLeaveOrderAlert.js:102 ~ cancelOrder ~ orderCancelRes:',
      //   orderCancelRes,
      // );

      if (orderCancelRes.status == 200) {
        onSuccessCancel();
      }

      return;
    } catch (e) {
      // Alert.alert('', 'Unable to cancel order.Please try again');
      console.log(e);
    }
  };

  return (
    <Modal visible={modalVisible} transparent={true} animationType={'fade'}>
      <View
        // blurType={'light'}
        // blurAmount={3}
        style={styles.mainOuterComponent}>
        <View style={styles.mainContainer}>
          <ModalCancelButton onPress={dismissModal} />
          <View
            style={[
              styles.bottomContainer,
              isDarkTheme && {backgroundColor: COLORS.dark_theme_background},
            ]}>
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.title, darkTextColor]}>
                Cannot leave order at door
              </Text>
              <Text style={[styles.desc, darkTextColor]}>
                {`If you are unable to leave order at door, please\nselect the reason.`}
              </Text>
            </View>

            <FlatList
              contentContainerStyle={{
                paddingHorizontal: rWidth(15),
                marginTop: 10,
              }}
              data={reasons}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    // console.log('hi---');
                    setSelectedOption(item);
                  }}
                  style={styles.optionContainer}>
                  <Image
                    style={styles.checkStyle}
                    source={selectedOption === item ? checked : unchecked}
                  />
                  <Text style={[styles.optionText, darkTextColor]}>
                    {item.option}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.buttonCon}>
              <CustomButton
                handleClick={onGoback}
                buttonText="Go Back"
                buttonStyle={[
                  styles.buttonStyle,
                  styles.goBackButton,
                  isDarkTheme && {backgroundColor: '#1B1F27'},
                ]}
                textStyle={{
                  color: isDarkTheme ? COLORS.pink_light : COLORS.primary_pink,
                }}
              />
              <CustomButton
                handleClick={cancelOrder}
                buttonText="Submit"
                buttonStyle={styles.buttonStyle}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainOuterComponent: {
    flex: 1,
    backgroundColor: '#00000095',
  },
  mainContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  title: {
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rHeight(22),
    color: COLORS.light_primary_text,
    paddingVertical: rHeight(8),
  },
  desc: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(13),
    textAlign: 'center',
    lineHeight: 20,
    paddingTop: 5,
  },
  buttonCon: {
    marginBottom: rHeight(40),
    marginLeft: '5%',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
  },
  buttonStyle: {
    width: '90%',
    height: rHeight(45),
  },
  goBackButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.pink_light,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
    paddingVertical: rHeight(14),
    paddingLeft: 10,
  },
  checkStyle: {
    width: 23,
    height: 23,
  },
});

export default CannotLeaveOrderAlert;
