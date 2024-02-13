import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useColorScheme} from './ColorSchemeContext';

const ImagePickerOptionAlert = props => {
  const {modalVisible, dismissModal, selectedOption, isShowRemovePhotoOption} =
    props;
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const viewBgColor = isDarkTheme && {
    backgroundColor: COLORS.dark_theme_background,
  };

  const PickerOptions = ({option, onPress, bottomBorder, image}) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.pickerOptionContainer}>
        <Image
          style={[
            styles.pickerOptionImg,
            isDarkTheme && {tintColor: COLORS.dark_primary_text},
          ]}
          source={image}
        />
        <Text
          style={[
            styles.pickerOptionText,
            isDarkTheme && {color: COLORS.dark_primary_text},
          ]}>
          {option}
        </Text>
        {bottomBorder && (
          <View
            style={[
              styles.seperator,
              isDarkTheme && {backgroundColor: '#3F444D'},
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <Modal visible={modalVisible} transparent={true} animationType={'fade'}>
      <View style={styles.mainOuterComponent}>
        <View style={styles.mainContainer}>
          <TouchableOpacity
            style={[
              styles.cancelButtonContainer,
              isDarkTheme && {backgroundColor: COLORS.dark_disabled_background},
            ]}
            onPress={dismissModal}>
            <Image
              resizeMode="contain"
              style={[
                styles.cancelButton,
                isDarkTheme && {tintColor: COLORS.dark_primary_text},
              ]}
              source={IMAGES.CANCEL}
            />
          </TouchableOpacity>
          <View style={[styles.bottomContainer, viewBgColor]}>
            <PickerOptions
              option="Take Photo"
              image={IMAGES.CAMERA}
              bottomBorder={true}
              onPress={() => {
                dismissModal();
                selectedOption(0);
              }}
            />
            <PickerOptions
              option="Choose From Gallery"
              image={IMAGES.GALLERY}
              bottomBorder={isShowRemovePhotoOption}
              onPress={() => {
                dismissModal();
                selectedOption(1);
              }}
            />
            {isShowRemovePhotoOption && (
              <PickerOptions
                option="Remove Photo"
                image={IMAGES.DELETE}
                onPress={() => {
                  dismissModal();
                  selectedOption(2);
                }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainOuterComponent: {
    flex: 1,
    backgroundColor: '#00000099',
  },
  mainContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: rHeight(16),
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
  bottomContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingBottom: rHeight(25),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  pickerOptionContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pickerOptionImg: {
    width: rWidth(20),
    height: rHeight(20),
    marginHorizontal: rWidth(20),
    tintColor: COLORS.light_primary_text,
  },
  pickerOptionText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(16),
    marginVertical: rHeight(20),
  },
  seperator: {
    position: 'absolute',
    bottom: 1,
    height: 1,
    width: '100%',
    backgroundColor: '#1D243330',
  },
});

export default ImagePickerOptionAlert;
