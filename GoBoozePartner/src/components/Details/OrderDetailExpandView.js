import * as React from 'react';
import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
import COLORS from '../../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../../constants/Constant';
import {rHeight, rWidth} from '../../constants/PixelSize';
import {useColorScheme} from '../ColorSchemeContext';
import FastImage from 'react-native-fast-image';

const OrderDetailExpandView = ({orderDetails}) => {
  console.log(
    '💕 ~ file: OrderDetailExpandView.js:9 ~ OrderDetailExpandView ~ orderDetails:',
    orderDetails,
  );
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkTextStyle = isDarkTheme && {color: '#FFFFFFBF'};

  const orderItem = ({item, index}) => {
    return (
      <View style={{overflow: 'hidden'}}>
        <View style={styles.orderItemCon}>
          <Text
            style={[
              styles.quantity,
              darkTextStyle,
            ]}>{`${item.orderQuantity}X`}</Text>

          <FastImage
            source={{
              uri: `https://d12keppzk8wa17.cloudfront.net/goboozestore/${item.variantImage}`,
            }}
            resizeMode="contain"
            style={styles.whiskeyImg}
          />
          <View style={{alignSelf: 'flex-start'}}>
            <Text style={[styles.nameTxt, darkTextStyle]}>
              {item.quantity}-Pack
            </Text>
            <Text
              numberOfLines={2}
              style={[styles.descriptionTxt, darkTextStyle]}>
              {item.variantName}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.seperator,
            isDarkTheme && {backgroundColor: COLORS.dark_disabled_background},
            index == orderDetails.length - 1 && {backgroundColor: 'clear'},
          ]}
        />
      </View>
    );
  };

  return (
    <View style={{}}>
      <View
        style={[
          styles.itemTextContainer,
          isDarkTheme && {backgroundColor: COLORS.dark_disabled_background},
        ]}>
        <Text style={[styles.itemText, darkTextStyle]}>ITEMS</Text>
      </View>
      <View style={{width: '100%'}}>
        <FlatList data={orderDetails} renderItem={orderItem} />
      </View>
    </View>
  );
};

export default OrderDetailExpandView;

const styles = StyleSheet.create({
  itemTextContainer: {
    backgroundColor: '#F1F3F9',
  },
  whiskeyImg: {
    width: '20%',
    height: rHeight(75),
    // backgroundColor: 'lightblue'
  },
  itemText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(14),
    paddingVertical: rHeight(7),
    paddingLeft: rWidth(15),
  },
  orderItemCon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: rHeight(20),
    width: '90%',
    marginLeft: '5%',
    // backgroundColor: 'yellow',
  },
  nameTxt: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(12),
    color: '#1D2433CC',
    paddingTop: 5,
  },
  descriptionTxt: {
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rHeight(14),
    lineHeight: 22,
    width: '90%',
    color: COLORS.light_primary_text,
    paddingTop: 5,
  },
  seperator: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.ligth_grey,
    marginTop: rHeight(20),
  },
  quantity: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(15),
    color: '#1D2433CC',
  },
});
