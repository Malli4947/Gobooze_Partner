import {BlurView} from '@react-native-community/blur';
import React from 'react';
import {StyleSheet, Text, View, Modal, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useColorScheme} from '../components/ColorSchemeContext';
import ModalCancelButton from '../components/ModalCancelButton';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import CustomButton from './CustomButton';

const AddPhotoAlert = props => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const {modalVisible, dismissModal, cancelOrder, openCamera} = props;
  const darkTextColor = isDarkTheme && {color: '#FFF'};

  return (
    <Modal visible={modalVisible} transparent={true} animationType={'fade'}>
      <View
        // blurType={'light'}
        // blurAmount={3}
        style={styles.mainOuterComponent}>
        <View style={styles.mainContainer}>
          <ModalCancelButton onPress={dismissModal} />
          <View
            style={[
              styles.bottomContainer,
              isDarkTheme && {backgroundColor: COLORS.dark_theme_background},
            ]}>
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.title, darkTextColor]}>
                Add Photo Of The Order
              </Text>
              <Text style={[styles.desc, darkTextColor]}>
                👉 Please leave the order on a clean surface
              </Text>
              <Text style={[styles.desc, darkTextColor]}>
                👉 Take 5 steps back and click a photo
              </Text>
            </View>
            <View style={styles.photoCon}>
              <Image
                resizeMode="contain"
                style={styles.photo}
                source={
                 
                    IMAGES.RIGHT_PHOTO_LIGHT
                }
              />
              <Image
                resizeMode="contain"
                style={styles.photo}
                source={
                 
                     IMAGES.WRONG_PHOTO_LIGHT
                }
              />
              
            </View>
            <View style={{marginHorizontal: rWidth(15), paddingBottom: rHeight(15)}}>
              <CustomButton
                image={IMAGES.CAMERA_OUTLINED}
                buttonText="Click Photo"
                buttonStyle={{height: rHeight(45)}}
                handleClick={openCamera}
              />
              {/* <TouchableOpacity
                onPress={() => {
                  console.log('hi---');
                }}>
                <Text
                  onPress={cancelOrder}
                  style={[
                    styles.bottomText,
                    isDarkTheme && {color: '#E44956'},
                  ]}>
                  Cannot leave order at door..
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </View>
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  title: {
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rHeight(22),
    color: COLORS.light_primary_text,
    paddingVertical: rHeight(8),
  },
  desc: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(13),
  },
  photoCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: '5%',
    marginTop: rHeight(20),
    marginBottom: rHeight(5),
  },
  photo: {
    width: rWidth(168),
    height: rHeight(232),
  },
  clockImg: {
    width: rWidth(22),
    height: rHeight(22),
    marginRight: 5,
  },
  bottomText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(15),
    marginTop: rWidth(15),
    paddingBottom: rHeight(45),
    alignSelf: 'center',
    color: COLORS.red_error,
  },
});

export default AddPhotoAlert;
