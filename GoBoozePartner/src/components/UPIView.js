import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {CONST_STYLES} from '../constants/ConstStyles';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useColorScheme} from './ColorSchemeContext';
import {BlurView} from '@react-native-community/blur';

const UPIView = ({orderDetails}) => {
  const [showQR, setShowQR] = useState(true);
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const seperatorBg = isDarkTheme && {backgroundColor: '#3F444D'};

  return (
    <View>
      {/* Collect via UPI view */}
      <View
        style={[
          styles.upiContainer,
          CONST_STYLES.shadow,
          isDarkTheme && {
            backgroundColor: COLORS.dark_con,
            borderColor: '#3F444D',
          },
        ]}>
        <View style={styles.topCon}>
          <Image
            style={styles.headerUpiImg}
            source={
              isDarkTheme ? IMAGES.UPI_FRAME_DARK : IMAGES.UPI_FRAME_LIGHT
            }
          />
          <View style={{marginLeft: 10}}>
            <Text
              style={[
                styles.collectCashText,
                isDarkTheme && {color: '#FFFFFF'},
              ]}>{`Collect $${orderDetails.amount} via UPI`}</Text>
            <Text
              style={[
                styles.cashDescText,
                isDarkTheme && {color: '#FFFFFFBF'},
              ]}>
              Payment goes directly to GoBooze
            </Text>
          </View>
        </View>
        <View style={styles.bottomUpiCon}>
          <View style={{alignItems: 'center', margin: 10}}>
            <Image
              style={styles.upiImg}
              source={isDarkTheme ? IMAGES.DUMMY_UPI_DARK : IMAGES.DUMMY_UPI}
            />
            <View style={styles.disclaimerCon}>
              <Image
                resizeMode="contain"
                style={{width: 20}}
                source={IMAGES.DISCLAIMER}
              />
              <Text style={styles.upiDisclaimer}>
                100% secure payment to GoBooze
              </Text>
            </View>
          </View>
          {showQR && (
            <BlurView
              style={styles.blurView}
              blurType={isDarkTheme ? 'dark' : 'light'}
              blurAmount={3}>
              <Pressable
                style={styles.seeQrImgCon}
                onPress={() => setShowQR(!showQR)}>
                <Image
                  resizeMode="contain"
                  style={styles.seeQrImg}
                  source={
                    isDarkTheme ? IMAGES.SEE_QR_DARK : IMAGES.SEE_QR_LIGHT
                  }
                />
              </Pressable>
            </BlurView>
          )}
        </View>
      </View>

      {/* seperator */}
      <View style={styles.seperatorCon}>
        <View style={[styles.seperatorLine, seperatorBg]} />
        <Text
          style={[styles.seperatorText, isDarkTheme && {color: '#FFFFFF99'}]}>
          OR
        </Text>
        <View style={[styles.seperatorLine, seperatorBg]} />
      </View>
    </View>
  );
};

export default UPIView;

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
});
