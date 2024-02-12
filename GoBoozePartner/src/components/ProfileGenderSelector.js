import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useColorScheme} from './ColorSchemeContext';
import Error from '../assets/Error.svg';

const radioHeigth = 22;

const ProfileGenderSelector = props => {
  const [isMaleSelected, setMaleSelected] = useState(false);
  const [isFemaleSelected, setFemaleSelected] = useState(false);
  const [isOthersSelected, setOthersSelected] = useState(false);
  const colorScheme = useColorScheme();

  const {heading} = props;
  const darkTheme = colorScheme === 'dark' && {color: COLORS.dark_primary_text};

  const Checkbox = ({type, onPress, isSelected}) => {
    return (
      <View style={styles.checkboxContainer}>
        <TouchableOpacity style={styles.radioButton} onPress={onPress}>
          {isSelected && <View style={styles.radioSelected} />}
        </TouchableOpacity>
        <Text style={styles.checkboxTitle}>{type}</Text>
      </View>
    );
  };

  const handleMaleSelection = () => {
    setFemaleSelected(false);
    setOthersSelected(false);
    setMaleSelected(true);
  };
  const handleFemaleSelection = () => {
    setOthersSelected(false);
    setMaleSelected(false);
    setFemaleSelected(true);
  };
  const handleOthersSelection = () => {
    setMaleSelected(false);
    setFemaleSelected(false);
    setOthersSelected(true);
  };

  return (
    <View style={[styles.container, darkTheme]}>
      {/* Title */}
      <Text style={[styles.phoneStaticText, darkTheme]}>
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
    fontSize: rHeight(17),
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
    width: rWidth(radioHeigth),
    height: rHeight(radioHeigth),
    borderRadius: 99,
    marginRight: rWidth(10),
    borderColor: COLORS.ligth_grey,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  radioSelected: {
    backgroundColor: COLORS.primary_skyblue,
    width: rWidth(radioHeigth),
    height: rHeight(radioHeigth),
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
});
