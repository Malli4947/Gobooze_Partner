import * as React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import COLORS from '../constants/Colors';
import {useColorScheme} from './ColorSchemeContext';
import {IMAGES} from '../constants/Constant';
import { rHeight, rWidth } from '../constants/PixelSize';

const ModalCancelButton = ({onPress}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.cancelButtonContainer,
        isDarkTheme && {backgroundColor: COLORS.dark_disabled_background},
      ]}
      onPress={onPress}>
      <Image
        resizeMode="contain"
        style={[
          styles.cancelButton,
          isDarkTheme && {tintColor: COLORS.dark_primary_text},
        ]}
        source={IMAGES.CANCEL}
      />
    </TouchableOpacity>
  );
};

export default ModalCancelButton;

const styles = StyleSheet.create({
  cancelButtonContainer: {
    width: rWidth(60),
    height: rHeight(60),
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 99,
    backgroundColor: 'black',
  },
  cancelButton: {
    width: rWidth(20),
    height: rHeight(20),
    alignSelf: 'center',
  },
});
