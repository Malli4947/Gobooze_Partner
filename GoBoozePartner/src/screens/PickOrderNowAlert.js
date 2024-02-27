import {BlurView} from '@react-native-community/blur';
import React from 'react';
import {StyleSheet, Text, View, Modal, Image} from 'react-native';
import {useColorScheme} from '../components/ColorSchemeContext';
import DetailsView from '../components/DetailsView';
import ModalCancelButton from '../components/ModalCancelButton';
import CustomSlideButton from '../components/SlideButton/CustomSlideButton';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';

const PickOrderNowAlert = props => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const {modalVisible, dismissModal, onReachedToEnd} = props;
  const darkTextColor = isDarkTheme && {color: '#FFF'};

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
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.newOrderText, darkTextColor]}>
                Pick Order Now!
              </Text>

              <View>
                <Image
                  style={styles.orderImg}
                  source={
                    isDarkTheme
                      ? IMAGES.PICK_ORDER_DARK
                      : IMAGES.PICK_ORDER_LIGHT
                  }
                />
                <View style={styles.timerContainer}>
                  <Text style={[styles.timerTxt]}>2:59</Text>
                </View>
              </View>
              <Text style={[styles.storeText, darkTextColor]}>
                Store has marked drink ready
              </Text>
              <Text style={[styles.collectText, darkTextColor]}>
                Please Collect now!
              </Text>

              <View
                style={[styles.detailCon, isDarkTheme && styles.detailConDark]}>
                <DetailsView
                  id="0"
                  image={IMAGES.BOX}
                  title={'Order:'}
                  value="4286690449"
                />
                <View
                  style={[
                    styles.detailSeperator,
                    isDarkTheme && {
                      backgroundColor: COLORS.dark_disabled_background,
                    },
                  ]}
                />
                <DetailsView
                  id="1"
                  image={IMAGES.CUSTOMER}
                  title={'Customer:'}
                  value="Rahul Singh"
                />
              </View>
            </View>
            <CustomSlideButton
              hideSeperator={true}
              disabled={false}
              title="Okay, I’m Picking!"
              confirmedText="Order picked"
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
  bottomContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 20,
  },
  newOrderText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(22),
    alignSelf: 'center',
    marginLeft: 20,
    marginTop: rHeight(15)
  },
  seperator: {
    width: 2,
    height: '100%',
    backgroundColor: COLORS.ligth_grey,
  },
  orderImg: {
    width: rHeight(110),
    height: rHeight(110),
    marginTop: rHeight(30),
  },
  timerContainer: {
    position: 'absolute',
    bottom: -14,
    backgroundColor: COLORS.blue,
    width: '15%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  timerTxt: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(14),
    color: '#FFF',
    paddingVertical: 7,
  },
  storeText: {
    alignSelf: 'center',
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rHeight(18),
    marginTop: rHeight(35),
  },
  collectText: {
    alignSelf: 'center',
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(14),
    marginTop: rHeight(15),
    color: '#1D2433CC',
  },
  detailCon: {
    marginTop: rHeight(30),
    alignSelf: 'flex-start',
    width: '90%',
    marginHorizontal: rWidth(20),
    borderColor: COLORS.ligth_grey,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: rWidth(15),
    paddingBottom: rHeight(15),
    paddingTop: rHeight(5),
  },
  detailConDark: {
    backgroundColor: COLORS.dark_con,
    borderColor: COLORS.dark_disabled_background,
  },
  detailSeperator: {
    height: 2,
    width: '100%',
    backgroundColor: COLORS.ligth_grey,
    marginTop: rHeight(15),
    marginBottom: rHeight(5),
  },
});

export default PickOrderNowAlert;
