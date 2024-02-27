import {View, StyleSheet, Image, Text} from 'react-native';
import React from 'react';
import {useColorScheme} from './ColorSchemeContext';
import { GRAPHIK_FONT } from '../constants/Constant';
import { rHeight } from '../constants/PixelSize';
import COLORS from '../constants/Colors';

const DetailsView = ({id, image, title, value}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkTextStyle = isDarkTheme && {color: COLORS.dark_primary_text};

  return (
    <View style={styles.orderDetailsContainer}>
      <Image
        tintColor={isDarkTheme && COLORS.dark_primary_text}
        style={styles.orderImg}
        source={image}
      />
      <Text style={[styles.orderText, darkTextStyle]}>{title}</Text>
      {id == 0 && (
        <Text style={[styles.orderText, darkTextStyle]}>
          {value.slice(0, value.length - 4)}
          <Text style={{fontFamily: GRAPHIK_FONT.SEMIBOLD}}>
            {value.slice(-4)}
          </Text>
        </Text>
      )}
      {id != 0 && (
        <Text style={[styles.orderText, darkTextStyle]}>{value}</Text>
      )}
    </View>
  );
};

export default DetailsView;

const styles = StyleSheet.create({
  orderDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rHeight(10),
  },
  orderImg: {
    width: rHeight(22),
    height: rHeight(22),
    marginRight: 7,
  },
  orderText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(14),
    paddingLeft: 5,
    color: COLORS.light_primary_text,
  },
});
