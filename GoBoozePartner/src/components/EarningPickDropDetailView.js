import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import COLORS from '../constants/Colors';
import {useColorScheme} from './ColorSchemeContext';
import {GRAPHIK_FONT} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import {CONST_STYLES} from '../constants/ConstStyles';

const EarningPickDropDetailView = ({
  earning,
  bottomLeft,
  bottomRight,
  isTripSum,
}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkTextColor = isDarkTheme && {color: '#FFF'};
  const darkSeperator = isDarkTheme && {
    borderColor: COLORS.dark_disabled_background,
  };
  const darkBg = isDarkTheme && {backgroundColor: COLORS.dark_con};
  return (
    <View
      style={[
        styles.orderDetailsContainer,
        CONST_STYLES.shadow,
        darkSeperator,
        darkBg,
      ]}>
      <View style={styles.earningContainer}>
        <Text style={[styles.lightText, darkTextColor]}>
          {earning.key}{' '}
          {!isTripSum && <Text style={styles.darkText}>{earning.value}</Text>}
        </Text>
        {isTripSum == true && (
          <Text
            style={[
              styles.darkText,
              styles.earningText,
              isDarkTheme && {color: COLORS.pink_light},
            ]}>
            {earning.value}
          </Text>
        )}
      </View>
      <View
        style={[
          styles.pickDropContainer,
          isDarkTheme && {
            borderTopColor: COLORS.dark_disabled_background,
          },
        ]}>
        <View style={{alignItems: 'center', flex: 1, paddingVertical: 20}}>
          <Text style={[styles.lightText, darkTextColor]}>
            {bottomLeft.key}
            <Text style={styles.darkText}>{bottomLeft.value}</Text>
          </Text>
        </View>

        <View
          style={[
            styles.seperator,
            isDarkTheme && {
              backgroundColor: COLORS.dark_disabled_background,
            },
          ]}
        />
        <View style={{alignItems: 'center', flex: 1}}>
          <Text style={[styles.lightText, darkTextColor]}>
            {bottomRight.key}
            <Text style={styles.darkText}>{bottomRight.value}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default EarningPickDropDetailView;

const styles = StyleSheet.create({
  orderDetailsContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.ligth_grey,
    marginTop: rHeight(30),
    marginHorizontal: rWidth(20),
    marginBottom: 30,
    backgroundColor: '#FFF',
  },
  earningContainer: {
    marginVertical: rHeight(20),
    alignSelf: 'center',
    alignItems: 'center',
  },
  lightText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(17),
    color: COLORS.light_primary_text,
  },
  darkText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(19),
  },
  pickDropContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.ligth_grey,
  },
  seperator: {
    width: 2,
    height: '100%',
    backgroundColor: COLORS.ligth_grey,
  },
  earningText: {
    color: COLORS.primary_pink,
    fontSize: rHeight(28),
    paddingTop: rHeight(15),
  },
});
