import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useColorScheme} from './ColorSchemeContext';

const PhoneNumberTextInput = props => {
  const [onTextinputFocus, setOnTextinputFocus] = useState(false);
  const colorScheme = useColorScheme();

  const {value, onChangePhoneNumText} = props;
  const darkTheme = colorScheme === 'dark' && {color: COLORS.dark_primary_text};
  const blueStaticText = onTextinputFocus && {color: COLORS.primary_skyblue};
  const blueUnderline = onTextinputFocus && {backgroundColor: COLORS.primary_skyblue};

  return (
    <View style={[styles.container, darkTheme]}>
      <Text style={[styles.phoneStaticText, darkTheme, blueStaticText]}>Phone Number</Text>
      <View style={[styles.textinputContainer]}>
        <Text style={[styles.countryCodeText, darkTheme]}>{`+61  AU`}</Text>
        <View style={styles.seperator}></View>
        <TextInput
          keyboardType="number-pad"
          style={[
            styles.input,
            darkTheme
          ]}
          maxLength={10}
          defaultValue={value}
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
      </View>
      <View style={[styles.underline, blueUnderline]}></View>
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
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(24),
    height: rHeight(40),
    flex: 1,
    color: COLORS.light_primary_text,
  },
  underline: {
    height: 2,
    width: '100%',
    backgroundColor: '#00000030',
    marginTop: 8,
  },
});
