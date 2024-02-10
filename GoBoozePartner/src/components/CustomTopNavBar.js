import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import RightArrow_1 from '../assets/light_theme_svgs/rightArrow.svg';
import RightArrow_2 from '../assets/dark_theme_svgs/rightArrow.svg';
import COLORS from '../constants/Colors';
import {useColorScheme} from './ColorSchemeContext';
import {GRAPHIK_FONT} from '../constants/Constant';
import {rWidth} from '../constants/PixelSize';

const CustomTopNavBar = ({onPress}) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {colorScheme === 'dark' ? <RightArrow_2 /> : <RightArrow_1 />}
      <Text
        style={[
          styles.header_Text_1,
          colorScheme === 'dark' && {color: COLORS.dark_primary_text},
        ]}>
        Back
      </Text>
    </TouchableOpacity>
  );
};

export default CustomTopNavBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  header_Text_1: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(16),
    marginLeft: rWidth(2),
    paddingLeft: 3,
  },
});
