import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import React, {useEffect} from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import COLORS from '../constants/Colors';
import {rHeight, rWidth} from '../constants/PixelSize';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as appActions from '../redux/actions/appActionCreator';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = props => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isDarkTheme = colorScheme === 'dark';
  const imagePath = isDarkTheme
    ? require('../assets/dak_theme_pngs/splashBackground.png')
    : require('../assets/light_theme_pngs/splashBackground.png');

  useEffect(() => {
    fetchData();
  }, []);
  // console.log(props.accessToken, '---splash---');

  const fetchData = async () => {
    try {
      const combinedData = await AsyncStorage.getItem('USER_DATA');
      const [accessToken, userId] = combinedData?.split(':') ?? [];

      if (userId) {
        dispatch(appActions.saveAccessToken(accessToken));
        dispatch(appActions.saveLoginUserId(userId));
        navigation.navigate('DashBoard');
      } else {
        navigation.navigate('Onboarding');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={[isDarkTheme ? styles.dark_container : styles.light_container]}>
      <ImageBackground source={imagePath} style={styles.background}>
        <View style={styles.logoContainer}>
          <Image
            source={isDarkTheme ? IMAGES.GO_BOOZE_DARK : IMAGES.GO_BOOZE}
            resizeMode="contain"
            style={[{height: rWidth(130)}]}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
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

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    accessToken: state.auth.bearerAccessToken,
  };
};

const mapDispatchToProps = dispatch => {
  return {appActions: bindActionCreators(appActions, dispatch)};
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
