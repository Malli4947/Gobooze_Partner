import * as React from 'react';
import {View, StyleSheet, Linking, Modal, Text, Pressable} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useColorScheme} from './ColorSchemeContext';

const LocationPermissionModal = props => {
  const colorScheme = useColorScheme();

  const {modalVisible, dismissModal} = props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={dismissModal}>
      <View style={{flex: 1, backgroundColor: 'rgba(27, 31, 39, 0.80)', justifyContent: 'center'}}>
        <View
          style={[
            styles.modalView,
            colorScheme === 'dark' && styles.modalView_2,
          ]}>
          <View>
            <Text
              style={[
                styles.modalText_1,
                colorScheme === 'dark' && styles.modalText_2,
              ]}>
              {`Accept Location\nPermission`}
            </Text>
            <Text
              style={[
                styles.modalHint_1,
                colorScheme === 'dark' && styles.modalHint_2,
              ]}>
              GoBooze requires access to your location, please grant permission
              in device settings. Also please ensure that the mobile location is
              switched on.
            </Text>
            <Pressable
              onPress={() => {
                Linking.openSettings();
                setTimeout(() => {
                  setHasPermission(true);
                  getOneTimeLocation();
                }, 2000);
                dismissModal()
                props.navigation.navigate('HomeScreen');
              }}
              style={styles.modal_button}>
              <Text style={styles.modalButton_text}>Open Settings</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LocationPermissionModal;

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: COLORS.light_con,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: rWidth(16),
    padding: 16,
  },
  modalView_2: {
    backgroundColor: COLORS.dark_con,
  },
  modalText_1: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rWidth(22),
    lineHeight: 30
  },
  modalText_2: {
    color: COLORS.dark_primary_text,
  },
  modalHint_1: {
    color: COLORS.light_disabled_text,
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(12),
    marginTop: rHeight(15),
    lineHeight: 18
  },
  modalHint_2: {
    color: COLORS.dark_disabled_text,
  },
  modal_button: {
    marginTop: rHeight(20),
    alignSelf: 'flex-end',
    marginRight: rWidth(20),
  },
  modalButton_text: {
    color: COLORS.primary_skyblue,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(16),
  },
});
