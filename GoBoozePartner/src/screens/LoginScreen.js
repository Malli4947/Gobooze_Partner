import {View, Text, StyleSheet, Keyboard, Image, Alert} from 'react-native';
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

const LoginScreen = props => {
  const colorScheme = useColorScheme();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardVisible(true);
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
    return () => {
      hideListener.remove();
      showListener.remove();
    };
  }, []);

  const handleContinuePress = () => {
    const regex = /^(?!1234567890$|0123456789$|0987654321$)[0-9]+$/;
    const cleanedPhoneNumber = mobileNumber.replace(/[-.,\s]/g, '');
    if (
      !/^(0?[1-9][0-9]{9})$/.test(cleanedPhoneNumber) ||
      mobileNumber.length !== 10 ||
      !regex.test(cleanedPhoneNumber)
    ) {
      setErrorMessage(true);
      return;
    }
    props.appActions.sendOtp(cleanedPhoneNumber, response => {
      if (response.status == 200) {
        props.navigation.navigate('OTP', {mobileNumber: mobileNumber});
      } else {
        Alert.alert('Invalid Mobile Number', response.error.message);
      }
    });
  };

  const onChangePhoneNumText = number => {
    setMobileNumber(number);
    setErrorMessage('');
    if (number.length == 10) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  };

  return (
    <View
      style={[
        styles.conatiner,
        {marginTop: !isKeyboardVisible ? 0 : -140},
        colorScheme == 'dark' && {
          backgroundColor: COLORS.dark_theme_background,
        },
      ]}>
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
      {/* </View> */}

      <View style={[styles.bottomContainerNoKeyboard]}>
        <Text
          style={[
            styles.otp_Text_1,
            colorScheme === 'dark' && styles.otp_Text_2,
          ]}>
          {`Make sure you can receive SMS to this number so\nthat wer can send you a code.`}
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
