import {BlurView} from '@react-native-community/blur';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
} from 'react-native';
import {useColorScheme} from '../components/ColorSchemeContext';
import ModalCancelButton from '../components/ModalCancelButton';
import CustomSlideButton from '../components/SlideButton/CustomSlideButton';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';

const NewOrderAlertScreen = props => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const {modalVisible, dismissModal, onReachedToEnd} = props;
  const [toggle, setToggle] = React.useState(false);
  const darkTextColor = isDarkTheme && {color: '#FFF'};
  const darkSeperator = isDarkTheme && {
    borderColor: COLORS.dark_disabled_background,
  };
  const darkBg = isDarkTheme && {backgroundColor: COLORS.dark_con};

  return (
    <Modal visible={modalVisible} transparent={true} animationType={'fade'}>
      <BlurView
        blurType={'light'}
        blurAmount={3}
        style={styles.mainOuterComponent}>
        <View style={styles.mainContainer}>
          <ModalCancelButton onPress={dismissModal} />
          <View
            style={[
              styles.bottomContainer,
              isDarkTheme && {backgroundColor: COLORS.dark_theme_background},
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 15,
                alignItems: 'center',
              }}>
              <View></View>
              <Text style={[styles.newOrderText, darkTextColor]}>
                New Order!
              </Text>
              <Text style={styles.denyText}>Deny</Text>
            </View>

            {/* total earning and pick drop kms */}
            <View
              style={[
                styles.orderDetailsContainer,
                styles.shadow,
                darkSeperator,
                darkBg,
              ]}>
              <View style={styles.earningContainer}>
                <Text style={[styles.lightText, darkTextColor]}>
                  Expected Earning <Text style={styles.darkText}>$5.89</Text>
                </Text>
              </View>
              <View
                style={[
                  styles.pickDropContainer,
                  isDarkTheme && {
                    borderTopColor: COLORS.dark_disabled_background,
                  },
                ]}>
                <View
                  style={{alignItems: 'center', flex: 1, paddingVertical: 20}}>
                  <Text style={[styles.lightText, darkTextColor]}>
                    Pickup: <Text style={styles.darkText}>2.5km</Text>
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
                    Drop: <Text style={styles.darkText}>1.79km</Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Pick up address */}
            <View
              style={[
                styles.pickupAddressContainer,
                styles.shadow,
                darkSeperator,
                darkBg,
              ]}>
              <View style={styles.pickUpTopView}>
                <Text style={[styles.darkText, darkTextColor]}>
                  PICKUP FROM
                </Text>
                <View style={styles.pickUpTopView}>
                  <Image
                    tintColor={isDarkTheme && COLORS.dark_primary_text}
                    style={styles.clockImg}
                    source={IMAGES.CLOCK}
                  />
                  <Text style={[darkTextColor]}>5min away</Text>
                </View>
              </View>
              <View style={styles.pickUpBottomView}>
                <View style={styles.logoImgView}>
                  <Image
                    resizeMode="contain"
                    style={styles.logoImg}
                    source={IMAGES.GO_LOGO}
                  />
                </View>
                <View style={{marginLeft: 10, width: '75%'}}>
                  <Text
                    style={[styles.darkText, {fontSize: 15}, darkTextColor]}>
                    Univeristy of Melbourne (3010)
                  </Text>
                  <Text
                    style={[
                      styles.lightText,
                      styles.addressText,
                      darkTextColor,
                    ]}>
                    1243 O'keefe Crest, Isaacstad, New South Wales 2364,
                    Australia
                  </Text>
                </View>
              </View>
            </View>

            <CustomSlideButton
              hideSeperator={true}
              title="Reached Pickup Location"
              confirmedText="Placing your order"
              onReachedToEnd={() => {
                dismissModal();
                onReachedToEnd();
              }}
            />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainOuterComponent: {
    flex: 1,
    backgroundColor: '#00000095',
  },
  mainContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: rHeight(30),
  },
  topSeperator: {
    position: 'absolute',
    marginTop: 20,
    width: 50,
    height: 4,
    backgroundColor: '#D1D5DB',
    marginBottom: 30,
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  cancelButtonContainer: {
    width: rWidth(60),
    height: rHeight(60),
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 99,
    backgroundColor: 'black',
  },
  cancelButton: {
    width: rWidth(20),
    height: rHeight(20),
    alignSelf: 'center',
  },
  newOrderText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(22),
    alignSelf: 'center',
    marginLeft: 20,
  },
  denyText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(14),
    color: '#E44956',
  },
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
  pickupAddressContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.ligth_grey,
    marginHorizontal: rWidth(20),
    padding: rHeight(20),
    backgroundColor: '#FFF',
  },
  pickUpTopView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clockImg: {
    width: rWidth(22),
    height: rHeight(22),
    marginRight: 5,
  },
  pickUpBottomView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: rHeight(15),
    marginHorizontal: 0,
  },
  logoImgView: {
    width: rHeight(60),
    height: rHeight(60),
    borderRadius: rHeight(16),
    backgroundColor: COLORS.primary_pink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    width: rHeight(40),
    height: rHeight(40),
  },
  addressText: {
    fontSize: 13,
    paddingTop: 5,
    lineHeight: 17,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default NewOrderAlertScreen;
