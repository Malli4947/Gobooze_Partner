import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  useColorScheme,
  StyleSheet,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';

const {RNNetworkSpeed, MobileSignalModule, NetworkTypeModule} = NativeModules;

const SignalStrengthComponent = () => {
  const [rssi, setRssi] = useState(null);
  const [isWifiEnabled, setIsWifiEnabled] = useState(false);
  const [mobileRssi, setMobileRssi] = useState(null);
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const darkSeperator = isDark && {
    backgroundColor: COLORS.dark_theme_background,
  };

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        ]);
      }
    };

    const getSignalStrength = async () => {
      try {
        await requestPermission();
        const networkType = await NetworkTypeModule.getActiveNetworkType();

        if (networkType === 'wifi') {
          const currentRssi = await WifiManager.getCurrentSignalStrength();
          if (typeof currentRssi === 'number') {
            setRssi(currentRssi);
            setIsWifiEnabled(true);
            setMobileRssi(null);
          }
        } else if (networkType === 'mobile') {
          const signal = await MobileSignalModule.getMobileSignalStrength();
          setMobileRssi(signal);
          setRssi(null);
          setIsWifiEnabled(false);
        } else {
          setRssi(null);
          setMobileRssi(null);
          setIsWifiEnabled(false);
        }
      } catch (err) {
        console.log('Error fetching signal:', err);
        setRssi(null);
        setMobileRssi(null);
        setIsWifiEnabled(false);
      }
    };

    getSignalStrength();
    const interval = setInterval(getSignalStrength, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(RNNetworkSpeed);
    const speedListener = eventEmitter.addListener('onSpeedUpdate', event => {
      setDownloadSpeed(event.downLoadSpeed);
      setUploadSpeed(event.upLoadSpeed);
    });

    RNNetworkSpeed.startListenNetworkSpeed();

    return () => {
      speedListener.remove();
      RNNetworkSpeed.stopListenNetworkSpeed();
    };
  }, []);

  const getSignalLabel = rssiValue => {
    if (rssiValue === 'Error' || rssiValue == null) return 'Signal: Error';
    if (rssiValue >= -50) return 'Signal: Excellent';
    if (rssiValue >= -60) return 'Signal: Good';
    if (rssiValue >= -70) return 'Signal: Fair';
    return 'Signal: Weak';
  };

  return (
    <View style={[styles.seperator, darkSeperator]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {isWifiEnabled && rssi != null ? (
          <>
            <Text style={[styles.lRightText1, isDark && styles.dRightText]}>
              Wi-Fi RSSI: {rssi} dBm
            </Text>
            <Text style={[styles.lRightText, isDark && styles.dRightText]}>
              {getSignalLabel(rssi)}
            </Text>
          </>
        ) : mobileRssi !== null ? (
          <>
            <Text style={[styles.lRightText1, isDark && styles.dRightText]}>
              Mobile RSSI: {mobileRssi} dBm
            </Text>
            <Text style={[styles.lRightText, isDark && styles.dRightText]}>
              {getSignalLabel(mobileRssi)}
            </Text>
          </>
        ) : (
          <Text style={[styles.lRightText1, isDark && styles.dRightText]}>
            No Signal Info Available
          </Text>
        )}
      </View>

      <Text style={[styles.lRightText2, isDark && styles.dRightText]}>
        {downloadSpeed
          ? `Download: ${downloadSpeed} Mbps | Upload: ${uploadSpeed} Mbps`
          : 'Checking Network Speed...'}
      </Text>
    </View>
  );
};

export default SignalStrengthComponent;

const styles = StyleSheet.create({
  seperator: {
    backgroundColor: COLORS.light_theme_background,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  lRightText1: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(14),
    textAlign: 'center',
  },
  lRightText: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(14),
    textAlign: 'center',
    marginLeft:rWidth(8)
  },
  lRightText2: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(14),
    textAlign: 'center',
    marginTop: rHeight(6),
  },
  dRightText: {
    color: '#FFF',
  },
});
