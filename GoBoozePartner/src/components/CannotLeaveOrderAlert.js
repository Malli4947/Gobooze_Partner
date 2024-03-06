import {BlurView} from '@react-native-community/blur';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Modal, Image, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useColorScheme} from '../components/ColorSchemeContext';
import ModalCancelButton from '../components/ModalCancelButton';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import CustomButton from './CustomButton';

const options = [
  {id: 0, selected: false, option: 'Customer request to meet 1'},
  {id: 1, selected: false, option: 'Customer request to meet 2'},
  {id: 2, selected: false, option: 'Customer request to meet 3'},
  {id: 3, selected: false, option: 'Customer request to meet 4'},
];

const CannotLeaveOrderAlert = props => {
  const colorScheme = useColorScheme();
  const [reasons, setReasons] = useState(options);
  const isDarkTheme = colorScheme === 'dark';
  const {modalVisible, dismissModal} = props;
  const darkTextColor = isDarkTheme && {color: '#FFF'};
  const checked = isDarkTheme ? IMAGES.CHECKED_DARK : IMAGES.CHECKED_LIGHT;
  const unchecked = isDarkTheme
    ? IMAGES.UNCHECKED_DARK
    : IMAGES.UNCHECKED_LIGHT;

  const itemSelected = index => {
    let tempOptions = [...reasons];
    tempOptions.forEach(option => {
      option.selected = false;
    });
    tempOptions[index].selected = true;
    setReasons(tempOptions);
  };

  const optionSelection = ({item, index}) => {
    return (
      <View style={styles.optionContainer}>
        <TouchableOpacity onPress={() => itemSelected(index)}>
          <Image
            style={styles.checkStyle}
            source={item.selected ? checked : unchecked}
          />
        </TouchableOpacity>
        <Text style={[styles.optionText, darkTextColor]}>{item.option}</Text>
      </View>
    );
  };

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
              <Text style={[styles.title, darkTextColor]}>
                Cannot leave order at door
              </Text>
              <Text style={[styles.desc, darkTextColor]}>
                {`If you are unable to leave order at door, please\nselect the reason.`}
              </Text>
            </View>

            <FlatList
              contentContainerStyle={{
                paddingHorizontal: rWidth(15),
                marginTop: 10,
              }}
              data={reasons}
              renderItem={optionSelection}
            />
            <View style={styles.buttonCon}>
              <CustomButton
                buttonText="Go Back"
                buttonStyle={[
                  styles.buttonStyle,
                  styles.goBackButton,
                  isDarkTheme && {backgroundColor: '#1B1F27'},
                ]}
                textStyle={{
                  color: isDarkTheme ? COLORS.pink_light : COLORS.primary_pink,
                }}
              />
              <CustomButton
                buttonText="Submit"
                buttonStyle={styles.buttonStyle}
              />
            </View>
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
    textAlign: 'center',
    lineHeight: 20,
    paddingTop: 5,
  },
  buttonCon: {
    marginBottom: rHeight(40),
    marginLeft: '5%',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
  },
  buttonStyle: {
    width: '90%',
    height: rHeight(45),
  },
  goBackButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.pink_light,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
    paddingVertical: rHeight(14),
    paddingLeft: 10,
  },
  checkStyle: {
    width: 23,
    height: 23,
  },
});

export default CannotLeaveOrderAlert;
