import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native';
import Mobile_1 from '../assets/light_theme_svgs/Mobile.svg';
import Mobile_2 from '../assets/dark_theme_svgs/Mobile.svg';
import {useColorScheme} from '../components/ColorSchemeContext';
import CustomStatusBar from '../components/CustomStatusBar';
import {rHeight, rWidth} from '../constants/PixelSize';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';

const OnboardingScreen = props => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark'

  return (
    <View
      style={[
        styles.light_container,
        isDarkTheme && styles.dark_container,
      ]}>
      <CustomStatusBar />
      <View style={styles.logo}>
        <Image
          source={IMAGES.GO_BOOZE}
          resizeMode="contain"
          style={[styles.goBoozeImg]}
        />
      </View>
      <FastImage
        source={isDarkTheme ? IMAGES.INTRO_DARK : IMAGES.INTRO_LIGHT}
        resizeMode="cover"
        style={[styles.image, isDarkTheme && {tintColor: COLORS.dark_con}]}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.con_1}>
          <Text
            style={[styles.ltext_1, isDarkTheme && styles.dtext_1]}>
            WELCOME TO THE WORLD OF WINE
          </Text>

          <Text
            style={[styles.ltext_2, isDarkTheme && styles.dtext_2]}>
            {`Here you pick up a\ndrink that fits all your\ncriteria`}
          </Text>

          <Text
            style={[styles.ltext_3, isDarkTheme && styles.dtext_3]}>
            {`Find low prices near you. We collect wine, beer and spirit prices from across the globe and put them on your mobile.`}
          </Text>
        </View>

        <View style={styles.con_2}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Login');
            }}
            style={styles.number_button}>
            {isDarkTheme ? <Mobile_2 /> : <Mobile_1 />}
            <Text style={styles.number_button_text}>
              Sign in via mobile number
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          onPress={() => {
            console.log('🚀 ~ file: Intro.js:129 ~ Intro ~ e:');
          }}
          style={styles.bottom_text}>
          Continue as guest
        </Text>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  light_container: {
    flex: 1,
    backgroundColor: COLORS.light_theme_background,
  },
  dark_container: {
    flex: 1,
    backgroundColor: COLORS.dark_theme_background,
  },
  logo: {
    alignSelf: 'center',
    marginTop: rHeight(26),
  },
  goBoozeImg: {
    height: rWidth(70),
  },
  image: {
    height: '38%',
    marginTop: Platform.OS == 'ios' ? -30 : 0,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: Platform.OS == 'android' ? rHeight(20) : rHeight(35),
    alignSelf: 'center',
    paddingHorizontal: rWidth(10),
    justifyContent: 'center',
  },
  con_1: {
    marginTop: rHeight(26),
  },
  ltext_1: {
    color: '#1D2433A6',
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(12),
  },
  dtext_1: {
    color: COLORS.dark_primary_text,
  },
  ltext_2: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rHeight(28),
    textAlign: 'left',
    lineHeight: rWidth(33),
    marginTop: rHeight(10),
  },
  dtext_2: {
    color: COLORS.dark_primary_text,
  },
  ltext_3: {
    color: COLORS.light_secondary_text,
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(14),
    marginTop: rHeight(10),
    marginRight: 10,
    lineHeight: 21,
  },
  dtext_3: {
    color: COLORS.dark_secondary_text,
  },
  con_2: {
    marginTop: rHeight(20),
  },
  number_button: {
    height: rHeight(52),
    marginLeft: rWidth(10),
    marginRight: rWidth(16),
    backgroundColor: COLORS.primary_pink,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  number_button_text: {
    color: COLORS.light_con,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(16),
    marginLeft: rWidth(5),
  },
  bottom_text: {
    color: COLORS.primary_pink,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(16),
    textAlign: 'center',
    marginTop: rHeight(20),
  },
});
