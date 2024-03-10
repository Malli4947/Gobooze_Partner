import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useColorScheme} from './ColorSchemeContext';

const radioHeigth = 22;

const ProfileGenderSelector = props => {
  const [isMaleSelected, setMaleSelected] = useState(false);
  const [isFemaleSelected, setFemaleSelected] = useState(false);
  const [isOthersSelected, setOthersSelected] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkThemeText = isDarkTheme && {color: COLORS.dark_primary_text};

  const {heading, selectedOption} = props;

  const Checkbox = ({type, onPress, isSelected}) => {
    return (
      <View style={styles.checkboxContainer}>
        <TouchableOpacity style={[styles.radioButton, isSelected && {borderWidth: 0}]} onPress={onPress}>
          {isSelected && <View style={styles.radioSelected}> 
            <Image resizeMode='contain' style={styles.checkImg} source={IMAGES.CHECK} />
          </View>}
        </TouchableOpacity>
        <Text style={[styles.checkboxTitle, darkThemeText]}>{type}</Text>
      </View>
    );
  };

  const handleMaleSelection = () => {
    setFemaleSelected(false);
    setOthersSelected(false);
    setMaleSelected(true);
    selectedOption(0)
  };
  const handleFemaleSelection = () => {
    setOthersSelected(false);
    setMaleSelected(false);
    setFemaleSelected(true);
    selectedOption(1)
  };
  const handleOthersSelection = () => {
    setMaleSelected(false);
    setFemaleSelected(false);
    setOthersSelected(true);
    selectedOption(2)
  };

  return (
    <View style={[styles.container, darkThemeText]}>
      {/* Title */}
      <Text style={[styles.phoneStaticText, darkThemeText]}>
        {heading}
        <Text style={{color: COLORS.red_error}}>*</Text>
      </Text>

      {/* Checkbox  */}
      <View style={[styles.textinputContainer]}>
        <Checkbox
          type={'Male'}
          onPress={handleMaleSelection}
          isSelected={isMaleSelected}
        />
        <Checkbox
          type={'Female'}
          onPress={handleFemaleSelection}
          isSelected={isFemaleSelected}
        />
        <Checkbox
          type={'Other'}
          onPress={handleOthersSelection}
          isSelected={isOthersSelected}
        />
      </View>
    </View>
  );
};

export default ProfileGenderSelector;

const styles = StyleSheet.create({
  container: {
    marginTop: rHeight(25),
    marginHorizontal: rWidth(15),
    backgroundColor: 'transparent',
  },
  phoneStaticText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(15),
    color: '#1D2433',
    marginBottom: rHeight(8),
    marginLeft: 3,
  },
  textinputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  radioButton: {
    width: rHeight(radioHeigth),
    height: rHeight(radioHeigth),
    borderRadius: rHeight(radioHeigth),
    marginRight: rWidth(10),
    borderColor: '#5D667850',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  radioSelected: {
    backgroundColor: COLORS.primary_skyblue,
    width: rWidth(radioHeigth),
    height: rHeight(radioHeigth),
    justifyContent: 'center',
    alignItems: 'center'
  },
  option: {
    flexDirection: 'row',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxTitle: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(15),
  },
  checkImg: {
    width: rWidth(13),
    height: rHeight(13),
  }
});
