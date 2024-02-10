import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Logo_2 from '../assets/dark_theme_svgs/IntroLogo.svg';
import Logo_1 from '../assets/light_theme_svgs/IntroLogo.svg';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native';
import Mobile_1 from '../assets/light_theme_svgs/Mobile.svg';
import Mobile_2 from '../assets/dark_theme_svgs/Mobile.svg';
import {useColorScheme} from '../components/ColorSchemeContext';
import CustomStatusBar from '../components/CustomStatusBar';
import {rHeight, rWidth} from '../constants/PixelSize';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT} from '../constants/Constant';

const OnboardingScreen = props => {
  const colorScheme = useColorScheme();
  const [iosResponse, setIosResponse] = useState();

  return (
    <View
      style={[
        colorScheme == 'dark' ? styles.dark_container : styles.light_container,
      ]}>
      <CustomStatusBar />
      <View style={styles.logo}>
        {colorScheme == 'dark' ? <Logo_2 /> : <Logo_1 />}
      </View>
      {colorScheme == 'dark' ? (
        <FastImage
          source={require('../assets/dak_theme_pngs/IntroImage.png')}
          resizeMode="contain"
          style={styles.image}
        />
      ) : (
        <FastImage
          source={require('../assets/light_theme_pngs/IntroImage.png')}
          resizeMode="contain"
          style={styles.image}
        />
      )}

      <View style={styles.bottomContainer}>
        <View style={styles.con_1}>
          <Text
            style={[styles.ltext_1, colorScheme == 'dark' && styles.dtext_1]}>
            WELCOME TO THE WORLD OF WINE
          </Text>

          <Text
            style={[styles.ltext_2, colorScheme == 'dark' && styles.dtext_2]}>
            {`Here you pick up a\ndrink that fits all your\ncriteria`}
          </Text>

          <Text
            style={[
              styles.ltext_3,
              colorScheme == 'dark' && styles.dtext_3,
            ]}>
            {`Find low prices near you. We collect wine, beer and spirit prices from across the globe and put them on your mobile.`}
          </Text>
        </View>

        <View style={styles.con_2}>
          <TouchableOpacity
            onPress={() => {
                props.navigation.navigate('Login');
            }}
            style={styles.number_button}>
            {colorScheme == 'dark' ? <Mobile_2 /> : <Mobile_1 />}
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
  image: {
    height: '35%',
    width: '100%',
    marginTop: rHeight(26),
  },
  bottomContainer: {
    position: 'absolute',
    bottom: rHeight(35),
    alignSelf: 'center',
    paddingHorizontal: rWidth(10),
    justifyContent: 'center',
    // backgroundColor: 'yellow'
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
    lineHeight: 35,
    marginTop: rHeight(10),
  },
  dtext_2: {
    color: COLORS.dark_primary_text,
  },
  ltext_3: {
    color: COLORS.light_secondary_text,
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(14),
    marginTop: rHeight(15),
    marginRight: 10,
    lineHeight: 21
  },
  dtext_3: {
    color: COLORS.dark_secondary_text,
  },
  con_2: {
    marginTop: rHeight(30),
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
