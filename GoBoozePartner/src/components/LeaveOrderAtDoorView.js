import * as React from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {CONST_STYLES} from '../constants/ConstStyles';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useColorScheme} from './ColorSchemeContext';
import CustomButton from './CustomButton';

const LeaveOrderAtDoorView = ({}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  return (
    <View
      style={[
        CONST_STYLES.shadow,
        styles.container,
        isDarkTheme && styles.containerDark,
      ]}>
      <View style={styles.topCon}>
        <Image
          style={styles.binImg}
          source={isDarkTheme ? IMAGES.BIN_DARK : IMAGES.BIN_LIGHT}
        />
        <View style={{marginLeft: rWidth(15)}}>
          <Text style={[styles.leaveText, isDarkTheme && {color: '#FFFFFF'}]}>
            Leave order at door
          </Text>
          <Text style={[styles.desc, isDarkTheme && {color: '#FFFFFFBF'}]}>
            click a clear photo of the order
          </Text>
        </View>
      </View>
      <CustomButton
        buttonText="Add Photo"
        showView={false}
        buttonStyle={{
          backgroundColor: isDarkTheme ? '#099A6A' : '#08875D',
          height: 43,
        }}
      />
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
