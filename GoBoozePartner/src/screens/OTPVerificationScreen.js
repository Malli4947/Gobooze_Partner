import {
  View,
  Text,
  Pressable,
  TextInput,
  Linking,
  Modal,
  StyleSheet,
  TouchableNativeFeedback,
  ScrollView,
  Keyboard,
  Image,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import CustomStatusBar from '../components/CustomStatusBar';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import COLORS from '../constants/Colors';
import CustomTopNavBar from '../components/CustomTopNavBar';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import LocationPermissionModal from '../components/LocationPermissionModal';
import {rHeight, rWidth} from '../constants/PixelSize';
import OTPTextView from '../components/OTPTextView';

const OTPVerificationScreen = props => {
  const colorScheme = useColorScheme();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputOtp, setInputOtp] = useState('');
  const [showOtpErrorMessage, setShowOtpErrorMessage] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(false);
  // --
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  //-
  const isDarkTheme = colorScheme === 'dark';

  const formatMobileNumber = number => {
    return number.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  };

  const formattedNumber = formatMobileNumber(
    props.route.params?.mobileNumber
      ? props.route.params.mobileNumber
      : '000000000',
  );

  const handleContinuePress = async () => {
    if (inputOtp.length != 5) {
      setShowOtpErrorMessage(true);
    } else {
      props.navigation.navigate('PresonalDetail');
      await AsyncStorage.setItem('OTPVerified', JSON.stringify('true'));
      getOneTimeLocation();
    }
  };

  useEffect(() => {
    if (!loading && hasPermission) {
      setTimeout(() => {
        setHasPermission(true);
        getOneTimeLocation();
      }, 2000);
    }
  }, [hasPermission, props.navigation]);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const PremissionCheck = JSON.parse(
        await AsyncStorage.getItem('permissionGiven'),
      );
      if (PremissionCheck == 'false') {
        setModalVisible(true);
      }
    } catch (e) {}
  };

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setHasPermission(true);
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        AsyncStorage.setItem('permissionGiven', JSON.stringify('true'));
        setModalVisible(false);
        navigation.navigate('HomeScreen');
        setHasPermission(true);
      },
      error => {
        setHasPermission(false);
        setModalVisible(true);
        AsyncStorage.setItem('permissionGiven', JSON.stringify('false'));
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  useEffect(() => {
    console.log('text change---', inputOtp.length);
    if (inputOtp.length != 5) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [inputOtp]);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      hideListener.remove();
      showListener.remove();
    };
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        marginTop: keyboardHeight == 0 ? 0 : -140,
      }}
      keyboardShouldPersistTaps={'handled'}
      style={[
        isDarkTheme && {
          backgroundColor: COLORS.dark_theme_background,
        },
      ]}>
      <CustomStatusBar
        backgroundColor={
          hasPermission === false
            ? 'rgba(27, 31, 39, 0.80)'
            : colorScheme == 'dark'
            ? COLORS.dark_con
            : COLORS.white
        }
      />

      <CustomTopNavBar
        onPress={() => {
          props.navigation.goBack();
        }}
      />

      <LocationPermissionModal
        modalVisible={false}
        dismissModal={() => setModalVisible(false)}
      />

      <View style={styles.con_2}>
        <View style={styles.logo}>
          <Image
            source={IMAGES.GO_BOOZE}
            resizeMode="contain"
            style={[styles.goBoozeImg]}
          />
        </View>
        <Text
          style={[styles.number_Text_1, isDarkTheme && styles.number_Text_2]}>
          Verification Code
        </Text>
        <View>
          <Text
            style={[styles.number_hint_1, isDarkTheme && styles.number_hint_2]}>
            {`Please enter the code we have sent to your phone\nnumber +61 ${formattedNumber}`}
          </Text>
          <Text
            onPress={() => {
              props.navigation.goBack();
            }}
            style={styles.edit_number}>
            Edit number?
          </Text>
        </View>

        <View style={{}}>
          <OTPTextView
            handleTextChange={value => setInputOtp(value)}
            containerStyle={{marginTop: rHeight(40)}}
            inputCount={5}
            textInputStyle={
              isDarkTheme ? {backgroundColor: 'transparent', color: '#FFF'} : {}
            }
            tintColor={
              showOtpErrorMessage ? COLORS.red_error : COLORS.primary_pink
            }
            offTintColor={
              showOtpErrorMessage ? COLORS.red_error : COLORS.ligth_grey
            }
          />
        </View>
      </View>

      {/* Bottom button view */}
      <View style={[styles.bottomContainerNoKeyboard]}>
        <Pressable style={styles.con_1}>
          <Text
            style={[styles.resend_otp_1, isDarkTheme && styles.resend_otp_2]}>
            Resend code in 0:59
          </Text>
        </Pressable>
        <CustomButton
          buttonText="Continue"
          disabled={buttonDisabled}
          handleClick={handleContinuePress}
          buttonStyle={[
            {
              backgroundColor: isDarkTheme
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
    </ScrollView>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light_theme_background,
  },
  edit_number: {
    color: COLORS.primary_pink,
    textAlign: 'center',
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(14),
    marginTop: rHeight(13),
  },
  inputs_con: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rHeight(42),
  },
  logo: {
    alignSelf: 'center',
    marginBottom: rHeight(30),
  },
  goBoozeImg: {
    height: rWidth(70),
  },
  text_input: {
    width: rWidth(52),
    height: rHeight(60),
    borderWidth: 1,
    borderColor: COLORS.light_disabled_background,
    borderRadius: 20,
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(24),
    textAlign: 'center',
    backgroundColor: COLORS.light_theme_background,
    marginHorizontal: rWidth(12),
  },
  text_input_1: {
    borderColor: COLORS.dark_disabled_background,
    color: COLORS.dark_primary_text,
    backgroundColor: COLORS.dark_theme_background,
  },
  resend_otp_1: {
    color: COLORS.light_primary_text,
    textAlign: 'center',
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(12),
  },
  resend_otp_2: {
    color: COLORS.dark_primary_text,
  },
  con_1: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: rHeight(100),
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
    marginTop: rHeight(15),
    textAlign: 'center',
    lineHeight: 22,
  },
  number_hint_2: {
    color: COLORS.dark_disabled_text,
  },
  bottomContainerNoKeyboard: {
    width: '90%',
    position: 'absolute',
    bottom: rHeight(20),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  bottomContainerWithKeyboard: {
    width: '90%',
  },
});
