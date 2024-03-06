import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';

const CustomButton = props => {
  const {
    buttonText,
    handleClick,
    buttonStyle,
    textStyle,
    disabled = false,
    showView = true,
    image
  } = props;

  return (
    <View style={[showView && styles.btnView]}>
      <TouchableOpacity
        disabled={disabled}
        style={[styles.buttonView, buttonStyle]}
        onPress={handleClick}>
        {image && <Image style={styles.img} source={image} />}
        <Text style={[styles.buttonText, textStyle]}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonView: {
    width: '100%',
    flexDirection: 'row',
    height: rHeight(54),
    backgroundColor: COLORS.primary_pink,
    borderRadius: rHeight(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: rHeight(20),
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: GRAPHIK_FONT.MEDIUM,
  },
  btnView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rHeight(20),
  },
  img: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
});
