import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, NativeModules, NativeEventEmitter } from 'react-native';
import COLORS from '../constants/Colors';
const { RNNetworkSpeed } = NativeModules;
import { useColorScheme } from 'react-native';
import { GRAPHIK_FONT } from '../constants/Constant';
import { rHeight,rWidth } from '../constants/PixelSize';
const NetworkSpeedIndicator = ({ isDarkTheme }) => {
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
 const colorScheme = useColorScheme();
  const isDark = colorScheme == 'dark';
  const darkSeperator = isDark && {
    backgroundColor: COLORS.dark_theme_background,
  };
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(RNNetworkSpeed);

    const speedListener = eventEmitter.addListener('onSpeedUpdate', event => {
      console.log(' Speed Update Event:', event);
      setDownloadSpeed(event.downLoadSpeed); // e.g., "56.20kb/s"
      setUploadSpeed(event.upLoadSpeed);     // e.g., "20.10kb/s"
    });

    RNNetworkSpeed.startListenNetworkSpeed();

    return () => {
      speedListener.remove();
      RNNetworkSpeed.stopListenNetworkSpeed();
    };
  }, []);

  return (
    <View style={[styles.seperator, darkSeperator]}>
     <Text style={[styles.lRightText1, isDark && styles.dRightText]}>
  {downloadSpeed
    ? `Download: ${downloadSpeed} Mbps | Upload: ${uploadSpeed} Mbps`
    : 'Checking Network Speed...'}
</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  seperator: {
    backgroundColor: COLORS.light_theme_background,
    height: rHeight(24),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
   
  },
  lRightText1: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(14),
  },
  lRightText: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(14),
    marginLeft: rWidth(14),
  },
  dRightText: {
    color: '#FFF',
  },
});

export default NetworkSpeedIndicator;
