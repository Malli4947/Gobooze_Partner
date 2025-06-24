import * as React from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {CONST_STYLES} from '../constants/ConstStyles';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useColorScheme} from './ColorSchemeContext';
import CustomButton from './CustomButton';

const LeaveOrderAtDoorView = ({Children}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  return (
    <View
      style={[
        CONST_STYLES.shadow,
        styles.container,
        isDarkTheme && styles.containerDark,
      ]}>
      <View style={[styles.topCon, {width: '80%'}]}>
        <Image
          style={styles.binImg}
          source={isDarkTheme ? IMAGES.BIN_DARK : IMAGES.BIN_LIGHT}
        />
        <View style={{marginLeft: rWidth(15)}}>
          <Text style={[styles.leaveText, isDarkTheme && {color: '#FFFFFF'}]}>
            Hand the order to customer.
          </Text>
          <Text style={[styles.desc, isDarkTheme && {color: '#FFFFFFBF'}]}>
            Note: Do not deliver order if the customer is not present
          </Text>
        </View>
      </View>
      {Children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#08875D4D',
    marginHorizontal: rWidth(20),
    marginTop: rHeight(15),
    backgroundColor: '#F1FEFA',
    padding: rWidth(15),
  },
  containerDark: {
    backgroundColor: '#08875D1A',
    borderColor: '#08875D99',
  },
  topCon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rHeight(15),
  },
  binImg: {
    height: rHeight(50),
    width: rHeight(50),
  },
  leaveText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
  },
  desc: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(13),
    paddingTop: 5,
  },
});

export default LeaveOrderAtDoorView;

