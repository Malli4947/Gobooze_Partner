import {View, StyleSheet, Image, Text} from 'react-native';
import React from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import COLORS from '../constants/Colors';
import {rHeight, rWidth} from '../constants/PixelSize';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import NavBarWithBackButton from '../components/NavBarWithBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomSlideButton from '../components/SlideButton/CustomSlideButton';
import {CONST_STYLES} from '../constants/ConstStyles';
import DetailsView from '../components/DetailsView';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';

const ReachedDropMapScreen = props => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkBg = isDarkTheme && {backgroundColor: COLORS.dark_con};
  const darkTextStyle = isDarkTheme && {color: COLORS.dark_primary_text};
  const darkSeperator = isDarkTheme && {
    borderColor: COLORS.dark_disabled_background,
  };

  return (
    <View style={[styles.container, isDarkTheme && styles.dark_container]}>
      <View style={{marginTop: insets.top}}>
        <NavBarWithBackButton title={'Ready Pickup'} />
      </View>
      <View
        style={{
          height: '50%',
          // backgroundColor: 'lightblue',
          marginTop: 10,
        }}>
        <MapView
          provider={PROVIDER_DEFAULT} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}></MapView>
        {/* map view */}
      </View>

      {/* ---------------- BOTTOM CONTAINER ---------------- */}
      <View style={[styles.bottomContainer, darkBg]}>
        <View
          style={[
            styles.topSeperator,
            isDarkTheme && {backgroundColor: '#FFFFFF80'},
          ]}
        />
        <Text style={[styles.kmText, isDarkTheme && {color: '#099A6A'}]}>
          {`${8} min`}
          <Text style={[{color: COLORS.light_primary_text}, darkTextStyle]}>
            {` (${3.5}km)`}
          </Text>
        </Text>

        {/* ------------- Address view -------------- */}
        <View
          style={[
            styles.pickupAddressContainer,
            CONST_STYLES.shadow,
            darkSeperator,
            darkBg,
          ]}>
          <View style={styles.addressContainer}>
            <View style={styles.addressTopView}>
              <View style={{width: '70%'}}>
                <Text style={[styles.lightBlackText, darkTextStyle]}>
                  Univeristy of Melbourne (3010)
                </Text>
                <Text style={[styles.ultralightBlackText, darkTextStyle]}>
                  1243 O'keefe Crest, Isaacstad, New South Wales 2364, Australia
                </Text>
              </View>
              <View style={styles.logoImgView}>
                <Image
                  resizeMode="contain"
                  style={styles.logoImg}
                  source={IMAGES.LOC_IMG}
                />
                <View style={styles.viewText}>
                  <Text style={[styles.imgViewTxt]}>View</Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.addressBottomView,
                isDarkTheme && styles.addressBottomViewDark,
              ]}>
              <View style={styles.callContainer}>
                <Image
                  tintColor={isDarkTheme && COLORS.pink_light}
                  resizeMode="contain"
                  style={styles.callImg}
                  source={IMAGES.CALL}
                />
                <Text
                  style={[
                    styles.callText,
                    isDarkTheme && {color: COLORS.pink_light},
                  ]}>
                  Call
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* --------------- ORDER DETAIL VIEW --------------- */}
        <View style={{marginHorizontal: rWidth(23), marginTop: 10}}>
          <DetailsView
            id="0"
            image={IMAGES.BOX}
            title={'Order:'}
            value="4286690449"
          />
          <DetailsView
            id="1"
            image={IMAGES.CUSTOMER}
            title={'Customer:'}
            value="Rahul Singh"
          />
        </View>

        {/* ------------- Bottom slide button ----------- */}
        <CustomSlideButton
          hideSeperator={true}
          title="Reached Pickup Location"
          confirmedText="Placing your order"
          onReachedToEnd={() => props.navigation.navigate('OrderPick')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  dark_container: {
    backgroundColor: COLORS.dark_theme_background,
  },
  map: {
    height: '80%',

  },
  logoContainer: {
    marginBottom: 100,
    alignItems: 'center',
  },
  partnerText: {
    marginTop: rHeight(20),
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rHeight(22),
    color: COLORS.primary_pink,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    // height: '50%',
  },
  topSeperator: {
    height: 4,
    width: '15%',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: COLORS.light_primary_opacity,
  },
  kmText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(20),
    color: '#08875D',
    marginLeft: rWidth(20),
  },
  pickupAddressContainer: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: COLORS.ligth_grey,
    marginHorizontal: rWidth(20),
    backgroundColor: '#FFF',
    marginTop: rHeight(20),
    overflow: 'hidden',
  },
  addressContainer: {
    overflow: 'hidden',
  },
  addressTopView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: rHeight(15),
  },
  addressBottomView: {
    backgroundColor: '#FDF1F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopColor: COLORS.ligth_grey,
  },
  addressBottomViewDark: {
    backgroundColor: COLORS.dark_theme_background,
    borderTopColor: COLORS.dark_disabled_background,
  },
  logoImgView: {
    width: rHeight(70),
    height: rHeight(70),
    borderRadius: rHeight(14),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImg: {
    width: rHeight(70),
    height: rHeight(70),
  },
  ultralightBlackText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(12),
    color: COLORS.light_primary_text,
    paddingTop: 5,
    lineHeight: 20,
  },
  lightBlackText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
    lineHeight: 21,
  },
  viewText: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.blue,
    width: '100%',
    height: rHeight(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgViewTxt: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: 11,
    color: '#FFF',
  },
  callContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callImg: {
    width: rWidth(22),
    height: rHeight(22),
  },
  callText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
    paddingVertical: 15,
    paddingLeft: 5,
    color: COLORS.primary_pink,
  },
  slideButtonContainer: {
    borderTopWidth: 2,
    borderTopColor: COLORS.ligth_grey,
    marginTop: rHeight(20),
    marginBottom: rHeight(15),
    paddingVertical: rHeight(10),
    paddingHorizontal: rWidth(20),
  },
});

export default ReachedDropMapScreen;
