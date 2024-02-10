import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import COLORS from '../constants/Colors';
import { GRAPHIK_FONT } from '../constants/Constant';
import { rHeight, rWidth } from '../constants/PixelSize';


const CustomButton = props => {
  const {
    buttonText,
    handleClick,
    buttonStyle,
    textStyle,
    disabled = false,
    showView = true,
  } = props;

  return (
    <View style={[showView && styles.btnView]}>
      <TouchableOpacity
        disabled={disabled}
        style={[styles.buttonView, buttonStyle]}
        onPress={handleClick}>
        <Text style={[styles.buttonText, textStyle]}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonView: {
    width: '100%',
    height: rHeight(54),
    backgroundColor: COLORS.primary_pink,
    borderRadius: rHeight(99),
    justifyContent: 'center',
    alignContent: 'center',
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
    marginTop: rHeight(20)
  },
});
