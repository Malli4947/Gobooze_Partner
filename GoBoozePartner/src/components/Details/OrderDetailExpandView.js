import * as React from 'react';
import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
import COLORS from '../../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../../constants/Constant';
import {rHeight, rWidth} from '../../constants/PixelSize';
import {useColorScheme} from '../ColorSchemeContext';

const OrderDetailExpandView = ({orderDetails}) => {
  const colorScheme = useColorScheme();

  const orderItem = ({item}) => {
    return (
      <View>
        <View style={styles.orderItemCon}>
          <Text
            style={{
              fontFamily: GRAPHIK_FONT.REGULAR,
            }}>{`${item.quantity}X`}</Text>
          <Image
            style={styles.whiskeyImg}
            resizeMode="contain"
            source={IMAGES.DUMMY_WHISKEY}
          />
          <View style={{alignSelf: 'flex-start'}}>
            <Text style={[styles.nameTxt]}>{item.name}</Text>
            <Text numberOfLines={2} style={[styles.descriptionTxt]}>
              {item.description}
            </Text>
          </View>
        </View>
        <View style={styles.seperator} />
      </View>
    );
  };

  return (
    <View style={{}}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemText}>ITEMS</Text>
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
    paddingTop: 5
  },
  descriptionTxt: {
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rHeight(14),
    lineHeight: 22,
    width: '90%',
    color: COLORS.light_primary_text,
    paddingTop: 5
  },
  seperator: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.ligth_grey,
    marginTop: rHeight(20),
  },
});
