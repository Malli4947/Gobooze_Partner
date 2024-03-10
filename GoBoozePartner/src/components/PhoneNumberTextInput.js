import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useColorScheme} from './ColorSchemeContext';
import Error from '../assets/Error.svg';

const PhoneNumberTextInput = props => {
  const {value, onChangePhoneNumText, showError} = props;

  const [onTextinputFocus, setOnTextinputFocus] = useState(false);
  const colorScheme = useColorScheme();
  // --
  const isDarkTheme = colorScheme === 'dark';
  const darkThemeText = isDarkTheme && {color: COLORS.dark_primary_text};
  const blueStaticText = onTextinputFocus && {color: COLORS.primary_skyblue};
  const blueUnderline = onTextinputFocus && {
    backgroundColor: COLORS.primary_skyblue,
  };
  const errorBgStyle = showError && {backgroundColor: COLORS.red_error};
  const errorTextStyle = showError && {color: COLORS.red_error};

  return (
    <View style={[styles.container, darkThemeText]}>
      <Text style={[styles.phoneStaticText, darkThemeText, blueStaticText]}>
        Phone Number
      </Text>
      <View style={[styles.textinputContainer]}>
        <Text style={[styles.countryCodeText, darkThemeText]}>{`+61  AU`}</Text>
        <View style={styles.seperator}></View>
        <TextInput
          keyboardType="number-pad"
          style={[styles.input, darkThemeText, errorTextStyle]}
          maxLength={10}
          value={value}
          onChangeText={onChangePhoneNumText}
          onFocus={() => setOnTextinputFocus(true)}
          onSubmitEditing={() => setOnTextinputFocus(false)}
          placeholder="000-000-000"
          placeholderTextColor={
            colorScheme === 'dark'
              ? COLORS.dark_disabled_text
              : COLORS.light_disabled_text
          }
        />
        {showError && (
          <View style={{paddingRight: 5}}>
            <Error />
          </View>
        )}
      </View>
      <View style={[styles.underline, blueUnderline, errorBgStyle]}></View>
      {showError && (
        <View style={[styles.errorCon, {}]}>
          <Text style={styles.errorText}>
            Please enter valid contact number
          </Text>
        </View>
      )}
    </View>
  );
};

export default PhoneNumberTextInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: rHeight(50),
    marginHorizontal: rWidth(15),
    backgroundColor: 'transparent',
  },
  phoneStaticText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(17),
    color: '#1D2433',
    marginBottom: rHeight(15),
  },
  textinputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  countryCodeText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(17),
  },
  seperator: {
    height: 30,
    width: 2,
    backgroundColor: COLORS.primary_skyblue,
    marginHorizontal: rWidth(15),
  },
  input: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(24),
    height: rHeight(50),
    flex: 1,
    color: COLORS.light_primary_text,
  },
  underline: {
    height: 2,
    width: '100%',
    backgroundColor: 'lightgrey',
    marginTop: 8,
  },
  errorCon: {
    marginTop: rHeight(8),
  },
  errorText: {
    color: COLORS.red_error,
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(13),
  },
});
