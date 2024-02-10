import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import CustomStatusBar from '../components/CustomStatusBar';
import RightArrow_1 from '../assets/light_theme_svgs/rightArrow.svg';
import RightArrow_2 from '../assets/dark_theme_svgs/rightArrow.svg';
import Flag from '../assets/Flag.svg';
import {useNavigation} from '@react-navigation/native';
import Error from '../assets/Error.svg';
import {rHeight, rWidth} from '../constants/PixelSize';
import Remove_1 from '../assets/CloseCircle.svg';
import Remove_2 from '../assets/dark_theme_svgs/CloseCircle.svg';
// import {useSelector, useDispatch} from 'react-redux';
import {increment, decrement} from '../../redux/features/CounterSilce';
// import {login} from '../../redux/features/AuthSlice';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT} from '../constants/Constant';
import CustomButton from '../components/CustomButton';
import PhoneNumberTextInput from '../components/PhoneNumberTextInput';
import CustomTopNavBar from '../components/CustomTopNavBar';

const LoginScreen = props => {
  const colorScheme = useColorScheme();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [mobileNumber, setMobileNumber] = useState('');
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  // const dispatch = useDispatch();
  // const count = useSelector(state => state.counter.value);
  // const {userData, isLoading} = useSelector(state => state.auth);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        console.log('keyboardDidShow');
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleContinuePress = () => {
    return;
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
    const params = {
      username: 'kminchelle',
      password: '0lelplR',
    };
    dispatch(login(params));
    navigation.navigate('Otp', {mobileNumber: mobileNumber});
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
        {flex: 1},
        colorScheme == 'dark'
          ? {backgroundColor: COLORS.dark_theme_background}
          : {backgroundColor: COLORS.light_theme_background},
      ]}>
      <CustomStatusBar />
      <CustomTopNavBar onPress={() => props.navigation.goBack()} />

      <View style={styles.con_2}>
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
      />
      {/* </View> */}

      {errorMessage && (
        <View style={[styles.errorCon, {}]}>
          <Error />
          <Text style={styles.errorText}>
            Please enter valid contact number
          </Text>
        </View>
      )}

      <View
        style={[
          isKeyboardVisible
            ? styles.bottomContainerWithKeyboard
            : styles.bottomContainerNoKeyboard,
        ]}>
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

export default LoginScreen;

const styles = StyleSheet.create({
  con_2: {
    marginTop: rHeight(42),
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
  errorCon: {
    marginLeft: rWidth(16),
    marginTop: rHeight(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#E02D3C',
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(12),
    marginLeft: rWidth(5),
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
  bottomContainerWithKeyboard: {
    width: '90%',
    marginTop: rHeight(40),
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
