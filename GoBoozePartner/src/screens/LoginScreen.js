import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import CustomStatusBar from '../components/CustomStatusBar';
import {rHeight, rWidth} from '../constants/PixelSize';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as appActions from '../redux/actions/appActionCreator';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import CustomButton from '../components/CustomButton';
import PhoneNumberTextInput from '../components/PhoneNumberTextInput';
import CustomTopNavBar from '../components/CustomTopNavBar';
import Loader from '../components/Loader';
import {MAIN_BASE_URL} from '../constants/Constant';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
const LoginScreen = props => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [showLoader, setShowLoader] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (mobileNumber.length == 9) {
      setButtonDisabled(false);
    }
    const showListener = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });
    return () => {
      hideListener.remove();
      showListener.remove();
    };
  }, [mobileNumber]);

  // const handleContinuePress = () => {
  //   // mobile number to login :'8142787271'
  //   setShowLoader(true);
  //   const regex = /^(?!1234567890$|0123456789$|0987654321$)[0-9]+$/;
  //   const cleanedPhoneNumber = mobileNumber.replace(/[-.,\s]/g, '');
  //   // Directly navigate to OTP screen with pre-filled OTP
  //   setTimeout(() => {
  //     setShowLoader(false);
  //     props.navigation.navigate('OTP', {mobileNumber: mobileNumber, otp: '1234'});
  //   }, 1000);
  // };
  const handleContinuePress = async () => {
    try {
      const regex = /^(?!1234567890$|0123456789$|0987654321$)[0-9]+$/;
      const cleanedPhoneNumber = mobileNumber.replace(/[-.,\s]/g, '');

      const obj = {
        phone: `+61${mobileNumber}`,
      };

      console.log(obj, 'obj----------------------');
      const response = await axios.post(
        `${MAIN_BASE_URL}admin/api/partner/send-otp`,
        obj,
      );
      const data = response.data;
      console.log(data, 'response=======================================');

      if (data.message === 'Mobile not registered') {
        Alert.alert('', 'Mobile Number is not registered.');
      } else {
        navigation.navigate('OTP', {mobileNumber: mobileNumber});
      }
    } catch (error) {
      console.log(error, 'error===============');
      Alert.alert('', 'Unable To Login Now. Please Try After Some Time');
    }
  };
  const onChangePhoneNumText = number => {
    setMobileNumber(number);
    setErrorMessage('');
    if (number.length == 9) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  };

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={[
            styles.conatiner,
            {marginTop: !isKeyboardVisible ? 0 : -(keyboardHeight / 4)},
            colorScheme == 'dark' && {
              backgroundColor: COLORS.dark_theme_background,
            },
          ]}>
          <Loader loading={showLoader} />
          <CustomStatusBar />
          <CustomTopNavBar onPress={() => props.navigation.goBack()} />

          <View style={styles.con_2}>
            <View style={styles.logo}>
              <Image
                source={IMAGES.GO_BOOZE}
                resizeMode="contain"
                style={[styles.goBoozeImg]}
              />
            </View>
            <Text
              style={[
                styles.number_Text_1,
                colorScheme === 'dark' && styles.number_Text_2,
              ]}>
              Your Phone Number
            </Text>
            <Text
              style={[
                styles.number_hint_1,
                colorScheme === 'dark' && styles.number_hint_2,
              ]}>
              Enter your phone number to get started
            </Text>
          </View>

          {/* Phone num input field */}
          <PhoneNumberTextInput
            onChangePhoneNumText={onChangePhoneNumText}
            value={mobileNumber}
            showError={false}
          />

          <View style={[styles.bottomContainerNoKeyboard]}>
            <Text
              style={[
                styles.otp_Text_1,
                colorScheme === 'dark' && styles.otp_Text_2,
              ]}>
              {`Make sure you can receive SMS to this number so\nthat we can send you a code.`}
            </Text>
            <CustomButton
              buttonText="Continue"
              disabled={buttonDisabled}
              handleClick={handleContinuePress}
              buttonStyle={[
                {
                  backgroundColor:
                    colorScheme === 'dark'
                      ? buttonDisabled
                        ? COLORS.dark_disabled_background
                        : COLORS.primary_pink
                      : buttonDisabled
                      ? COLORS.light_disabled_background
                      : COLORS.primary_pink,
                },
              ]}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    accessToken: state.auth.bearerAccessToken,
  };
};

const mapDispatchToProps = dispatch => {
  return {appActions: bindActionCreators(appActions, dispatch)};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: COLORS.light_theme_background,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: rHeight(30),
  },
  goBoozeImg: {
    height: rWidth(70),
  },
  con_2: {
    marginTop: rHeight(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  number_Text_1: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rWidth(23),
  },
  number_Text_2: {
    color: COLORS.dark_primary_text,
  },
  number_hint_1: {
    color: COLORS.light_disabled_text,
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(14),
    marginTop: rHeight(8),
  },
  number_hint_2: {
    color: COLORS.dark_disabled_text,
  },
  otp_Text_1: {
    color: COLORS.light_disabled_text,
    textAlign: 'center',
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(12),
    lineHeight: 18,
  },
  otp_Text_2: {
    color: COLORS.dark_disabled_text,
  },
  remove: {
    right: rWidth(25),
  },
  bottomContainerNoKeyboard: {
    width: '90%',
    position: 'absolute',
    bottom: rHeight(40),
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
