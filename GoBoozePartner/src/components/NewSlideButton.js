import React, {useState, useRef} from 'react';
import {
  View,
  PanResponder,
  Animated,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import {rHeight, rWidth} from '../constants/PixelSize';
import COLORS from '../constants/Colors';
import {useColorScheme} from './ColorSchemeContext';
import {flingGestureHandlerProps} from 'react-native-gesture-handler/lib/typescript/handlers/FlingGestureHandler';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {useNavigation} from '@react-navigation/native';

const NewSlideButton = ({
  title,
  navigationScreen,
  onComplete,
  orderData,
  slideButoon = true,
}) => {
  const navigation = useNavigation();
  const [sliderValue, setSliderValue] = useState(0);
  const [buttonText, setButtonText] = useState('Slide to Accept');
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const isFullySlidRef = useRef(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => slideButoon, // Allow pan responder only if slideButoon is true
    onPanResponderMove: (event, gestureState) => {
      if (slideButoon) {
        // Check slideButoon before handling move
        const {moveX} = gestureState;
        const newValue = Math.min(1, Math.max(0, moveX / 290));
        if (sliderValue !== 1) {
          setSliderValue(newValue);
        }
        knobPosition.setValue(Math.min(290, Math.max(0, moveX)));
      }
    },
    onPanResponderRelease: () => {
      if (slideButoon) {
        // Check slideButoon before handling release
        if (isFullySlidRef.current === false) {
          if (sliderValue < 0.5) {
            Animated.timing(knobPosition, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          } else if (sliderValue > 0.5) {
            Animated.timing(knobPosition, {
              toValue: rWidth(290),
              duration: 200,
              useNativeDriver: true,
            }).start();
            isFullySlidRef.current = true;
            setSliderValue(1);
            onComplete();
            navigation.navigate(navigationScreen, {orderDetails: orderData});
          }
        }
      }
    },
  });

  const knobPosition = useRef(new Animated.Value(0)).current;

  return (
    <View
      style={[
        styles.mainCon,
        isDarkTheme && {backgroundColor: COLORS.dark_con},
      ]}>
      <View
        style={[styles.buttonCon, isDarkTheme && {backgroundColor: '#F33FAE'}]}
        {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.knobButton,
            {
              transform: [{translateX: knobPosition}],
            },
          ]}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={IMAGES.ARROW_RIGHT}
          />
        </Animated.View>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </View>
  );
};

export default NewSlideButton;

const styles = StyleSheet.create({
  mainCon: {
    paddingLeft: rWidth(16),
    paddingRight: rWidth(16),
    backgroundColor: COLORS.light_con,
    marginTop: rHeight(24),
    marginBottom: rHeight(10),
  },
  buttonCon: {
    backgroundColor: '#D3178A',
    // width: rWidth(343),
    borderRadius: 99,
    padding: 2,
    height: rHeight(52),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  knobButton: {
    width: rWidth(64),
    height: rHeight(48),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light_con,
    borderRadius: 99,
    position: 'absolute',
    left: 1,
  },
  buttonText: {
    textAlign: 'center',
    color: COLORS.white,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(16),
  },
  image: {
    width: rWidth(22),
    height: rHeight(22),
    marginRight: 5,
  },
});
