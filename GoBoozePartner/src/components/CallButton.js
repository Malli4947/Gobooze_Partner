import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useColorScheme} from './ColorSchemeContext';

const CallButton = ({onPress}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.addressBottomView,
        isDarkTheme && styles.addressBottomViewDark,
      ]}>
      <View style={styles.callContainer}>
        <Image
          tintColor={isDarkTheme && COLORS.pink_light}
          resizeMode="contain"
          style={styles.callImg}
          source={IMAGES.CALL}
        />
        <Text
          style={[styles.callText, isDarkTheme && {color: COLORS.pink_light}]}>
          Call
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CallButton;

const styles = StyleSheet.create({
  addressBottomView: {
    backgroundColor: '#FDF1F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopColor: COLORS.ligth_grey,
  },
  addressBottomViewDark: {
    backgroundColor: COLORS.dark_theme_background,
    borderTopColor: COLORS.dark_disabled_background,
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
});
