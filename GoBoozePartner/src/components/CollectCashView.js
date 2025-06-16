import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {CONST_STYLES} from '../constants/ConstStyles';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useColorScheme} from './ColorSchemeContext';

const CollectCashView = ({
  orderDetails,
  onCheckboxPress,
  isChecked,
  isPaidOnline,
}) => {
  // console.log('💕 ~ file: CollectCashView.js:16 ~ orderDetails:', orderDetails);
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkTxt = isDarkTheme && {color: COLORS.dark_primary_text};
  const lightTxt = isDarkTheme && {color: '#FFFFFFBF'};
  const checked = isDarkTheme ? IMAGES.CHECKED_DARK : IMAGES.CHECKED_LIGHT;
  const unchecked = isDarkTheme
    ? IMAGES.UNCHECKED_DARK
    : IMAGES.UNCHECKED_LIGHT;

  return (
    <View>
      {/* Collect via cash view */}
      <View
        style={[
          styles.detailsContainer,
          CONST_STYLES.shadow,
          isDarkTheme && styles.dark_container,
        ]}>
        <View style={styles.topView}>
          <View style={styles.imgTextContainer}>
            {isPaidOnline && (
              <Image
                style={styles.img}
                source={isDarkTheme ? IMAGES.PAID_DARK : IMAGES.PAID_LIGHT}
              />
            )}
            {!isPaidOnline && (
              <Image
                style={styles.img}
                source={
                  isDarkTheme
                    ? IMAGES.COLLECTCASH_DARK
                    : IMAGES.COLLECTCASH_LIGHT
                }
              />
            )}

            <View style={{marginLeft: 15, marginVertical: rHeight(13)}}>
              {isPaidOnline && (
                <Text style={[styles.amountText, darkTxt]}>Paid Online</Text>
              )}
              {!isPaidOnline && (
                <Text style={[styles.amountText, darkTxt]}>
                  {`Collect Cash: `}
                  <Text
                    style={{
                      fontFamily: GRAPHIK_FONT.SEMIBOLD,
                    }}>{` $${orderDetails.amount}`}</Text>
                </Text>
              )}

              <Text
                style={[
                  styles.orderText,
                  // lightTxt,
                ]}>
                  {`Order: ${orderDetails?.order?.sequence_number}`}
              </Text>
            </View>
          </View>
          {!isPaidOnline && (
            <TouchableOpacity onPress={onCheckboxPress}>
              <Image
                style={styles.checkbox}
                source={isChecked ? checked : unchecked}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CollectCashView;

const styles = StyleSheet.create({
  dark_container: {
    backgroundColor: COLORS.dark_con,
    borderColor: COLORS.dark_disabled_background,
  },
  upiContainer: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.ligth_grey,
    marginHorizontal: rWidth(20),
    marginTop: rHeight(15),
    backgroundColor: '#FFF',
  },
  topCon: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: rWidth(15),
    marginTop: rHeight(15),
  },
  headerUpiImg: {
    width: rWidth(50),
    height: rHeight(50),
  },
  collectCashText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
    color: COLORS.light_primary_text,
  },
  cashDescText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(13),
    color: '#1D2433CC',
    paddingTop: 5,
  },
  bottomUpiCon: {
    marginVertical: rHeight(15),
    marginHorizontal: rWidth(15),
  },
  upiImg: {
    width: rWidth(150),
    height: rHeight(150),
  },
  upiDisclaimer: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(12),
  },
  disclaimerCon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  seeQrImgCon: {
    position: 'absolute',
    bottom: 55,
    width: '100%',
    height: '30%',
  },
  seeQrImg: {
    width: '100%',
    height: '100%',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    width: '70%',
    height: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
  },
  seperatorCon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: rHeight(20),
  },
  seperatorLine: {
    backgroundColor: '#E1E6EF',
    height: 1,
    width: '30%',
  },
  seperatorText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(16),
    paddingHorizontal: rWidth(20),
    color: COLORS.light_primary_opacity,
  },
  detailsContainer: {
    marginTop: rHeight(20),
    borderWidth: 1,
    borderRadius: 20,
    borderColor: COLORS.ligth_grey,
    marginHorizontal: rWidth(20),
    backgroundColor: '#FFF',
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: rWidth(20),
    alignItems: 'center',
  },
  imgTextContainer: {
    marginVertical: rHeight(15),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgContainer: {
    backgroundColor: '#F1F3F9',
    width: rWidth(50),
    height: rHeight(50),
    borderRadius: rHeight(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: rWidth(50),
    height: rHeight(50),
  },
  checkbox: {
    width: rWidth(23),
    height: rHeight(23),
  },
  amountText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
    color: COLORS.light_primary_text,
  },
  orderText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(12),
    color: '#1D2433CC',
    paddingTop: 5,
  },
  seperator: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.ligth_grey,
    marginBottom: rHeight(5),
  },
});

