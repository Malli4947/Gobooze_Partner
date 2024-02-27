import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import COLORS from '../../constants/Colors';
import {IMAGES} from '../../constants/Constant';
import {rHeight, rWidth} from '../../constants/PixelSize';
import {useColorScheme} from '../ColorSchemeContext';
import SlideButton from './SlideButton';

const CustomSlideButton = props => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const {
    title,
    confirmedText,
    hideSeperator = false,
    onReachedToEnd,
    containerColor,
    titleStyle,
    imgColor,
    disabled = false,
    thumbColor,
  } = props;

  const containerColorStyle = containerColor && {
    backgroundColor: containerColor,
  };

  return (
    <View
      style={[
        styles.container,
        isDarkTheme && {borderTopColor: COLORS.dark_disabled_background},
        hideSeperator == true && {
          borderTopColor: 'clear',
          marginTop: 10,
          borderTopWidth: 0,
        },
      ]}>
      <SlideButton
        title={title}
        confirmedText={confirmedText}
        onReachedToEnd={onReachedToEnd}
        disabled={disabled}
        icon={
          <Image
            tintColor={imgColor && imgColor}
            style={styles.image}
            resizeMode="contain"
            source={IMAGES.ARROW_RIGHT}
          />
        }
        containerStyle={[
          {
            backgroundColor: isDarkTheme
              ? COLORS.pink_light
              : COLORS.primary_pink,
          },
          containerColorStyle,
        ]}
        underlayStyle={[
          isDarkTheme ? styles.underlayDark : styles.underlayLight,
          containerColorStyle,
          {height: 54},
        ]}
        titleStyle={{color: titleStyle ? titleStyle : '#FFF'}}
        thumbStyle={{backgroundColor: thumbColor ? thumbColor : '#FFFFFF', width: rWidth(65)}}
      />
    </View>
  );
};

export default CustomSlideButton;

const styles = StyleSheet.create({
  underlayLight: {
    backgroundColor: COLORS.primary_pink,
  },
  underlayDark: {
    backgroundColor: COLORS.pink_light,
  },
  image: {
    width: rWidth(22),
    height: rHeight(22),
    marginRight: 5,
  },
  container: {
    borderTopWidth: 2,
    borderTopColor: COLORS.ligth_grey,
    paddingTop: rHeight(20),
    marginBottom: rHeight(15),
    paddingVertical: rHeight(10),
    paddingHorizontal: rWidth(20),
  },
});
