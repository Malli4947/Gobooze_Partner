import {View, ImageBackground, StyleSheet, Image} from 'react-native';
import React from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import COLORS from '../constants/Colors';
import {rHeight, rWidth} from '../constants/PixelSize';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';

const SplashScreen = props => {
  const colorScheme = useColorScheme();
  const imagePath =
    colorScheme === 'dark'
      ? require('../assets/dak_theme_pngs/splashBackground.png')
      : require('../assets/light_theme_pngs/splashBackground.png');

  return (
    <View
      style={[
        colorScheme == 'dark' ? styles.dark_container : styles.light_container,
      ]}>
      <ImageBackground source={imagePath} style={styles.background}>
        <View style={styles.logoContainer}>
          <Image
            source={IMAGES.GO_BOOZE}
            resizeMode="contain"
            style={[{height: rWidth(130)}]}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  light_container: {
    flex: 1,
    backgroundColor: COLORS.light_theme_background,
  },
  dark_container: {
    flex: 1,
    backgroundColor: COLORS.dark_theme_background,
  },
  logoContainer: {
    marginBottom: 100,
    alignItems: 'center',
  },
  partnerText: {
    marginTop: rHeight(20),
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rHeight(22),
    color: COLORS.primary_pink,
  },
});

export default SplashScreen;
