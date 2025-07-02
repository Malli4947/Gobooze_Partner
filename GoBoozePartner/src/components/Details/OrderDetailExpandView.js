import * as React from 'react';
import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
import COLORS from '../../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../../constants/Constant';
import {rHeight, rWidth} from '../../constants/PixelSize';
import {useColorScheme} from '../ColorSchemeContext';
import FastImage from 'react-native-fast-image';

const OrderDetailExpandView = ({orderDetails}) => {
  // console.log(
  //   '💕 ~ file: OrderDetailExpandView.js:9 ~ OrderDetailExpandView ~ orderDetails:',
  //   orderDetails,
  // );
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkTextStyle = isDarkTheme && {color: '#FFFFFFBF'};

  const orderItem = ({item, index}) => {
    return (
      <View style={{overflow: 'hidden'}}>
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
          <Text style={[styles.quantity, darkTextStyle]}>
            {item.orderQuantity}x
          </Text>

          <FastImage
            source={{
              uri: `https://gobooze-tst-new.s3.ap-southeast-2.amazonaws.com/goboozestore/
${item.variantImage}`,
            }}
            resizeMode="contain"
            style={styles.whiskeyImg}
          />
          <View
            style={{
              alignSelf: 'flex-start',
              width: '70%',
            }}>
            <Text style={[styles.nameTxt, darkTextStyle, {width: '100%'}]}>
              {item.quantity}-Pack
            </Text>
            <Text
              numberOfLines={2}
              style={[styles.descriptionTxt, darkTextStyle, {width: '100%'}]}>
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
    width: '15%',
    height: rHeight(75),
    // backgroundColor: 'lightblue'
    marginLeft: rWidth(20),
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
    width: '80%',
    marginLeft: '5%',
    // backgroundColor: 'yellow',
  },
  nameTxt: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(12),
    color: '#1D2433CC',
    paddingTop: rHeight(5),
    paddingLeft: rWidth(30),
  },
  descriptionTxt: {
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rHeight(14),
    lineHeight: 22,
    width: '46%',
    color: COLORS.light_primary_text,
    paddingTop: rHeight(5),
    paddingLeft: rWidth(30),
  },
  seperator: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.ligth_grey,
    marginTop: rHeight(20),
  },
  quantity: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(20),
    color: '#000',
    marginLeft: rWidth(16),
  },
});
