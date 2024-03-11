import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import COLORS from '../constants/Colors';
import {useColorScheme} from '../components/ColorSchemeContext';
import CustomStatusBar from '../components/CustomStatusBar';
import {IMAGES} from '../constants/Constant';
import {rWidth} from '../constants/PixelSize';
import CustomButton from '../components/CustomButton';
import Geolocation from '@react-native-community/geolocation';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useNavigation} from '@react-navigation/native';

const LocationScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  const checkLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        console.log(granted, 'permission android--');
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else if (Platform.OS === 'ios') {
      try {
        const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        console.log(status, 'permission ios--');
      } catch (err) {
        console.log(err, 'error');
      }
    }
  };
  useEffect(() => {
    checkLocationPermission();
  }, []);

  const getOneTimeLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        navigation.navigate('DashBoard');
      },
      error => {
        console.log(error, 'error--');
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };
  return (
    <View
      style={[styles.light_container, isDarkTheme && styles.dark_container]}>
      <CustomStatusBar />
      <ImageBackground
        source={IMAGES.INTRO_DARK}
        resizeMode="contain"
        style={styles.backgroundImage}>
        <CustomButton
          buttonText="Give Location Permission"
          disabled={false}
          handleClick={getOneTimeLocation}
          buttonStyle={[styles.button]}
        />
      </ImageBackground>
    </View>
  );
};

export default LocationScreen;
const styles = StyleSheet.create({
  light_container: {
    flex: 1,
    backgroundColor: COLORS.light_theme_background,
  },
  dark_container: {
    backgroundColor: COLORS.dark_theme_background,
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    padding: 16,
    justifyContent: 'flex-end',
  },
  button: {
    bottom: Platform.OS === 'ios' ? 80 : 20,
  },
});
