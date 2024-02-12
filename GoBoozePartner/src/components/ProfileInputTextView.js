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
import Error from '../assets/Error.svg';

const ProfileInputTextView = props => {
  const [onTextinputFocus, setOnTextinputFocus] = useState(false);
  const colorScheme = useColorScheme();

  const {value, onChangePhoneNumText, heading, placeholder, isMobileInput} =
    props;

  const darkTheme = colorScheme === 'dark' && {color: COLORS.dark_primary_text};
  const blueBorderOnEditing = onTextinputFocus && styles.textinputContainerEditing;

  return (
    <View style={[styles.container, darkTheme]}>
      {/* Title */}
      <Text style={[styles.phoneStaticText, darkTheme]}>
        {heading}
        <Text style={{color: COLORS.red_error}}>*</Text>
      </Text>

      {/* Text Input */}
      <View style={[styles.textinputContainer, blueBorderOnEditing]}>
        {isMobileInput && (
          <Text style={[styles.countryCodeText, darkTheme]}>{`+61`}</Text>
        )}
        <TextInput
          keyboardType={isMobileInput ? 'number-pad' : 'email-address'}
          style={[styles.input, darkTheme]}
          maxLength={10}
          defaultValue={value}
          onChangeText={onChangePhoneNumText}
          onFocus={() => setOnTextinputFocus(true)}
          onSubmitEditing={() => setOnTextinputFocus(false)}
          onBlur={() => setOnTextinputFocus(false)}
          placeholder={placeholder}
          placeholderTextColor={
            colorScheme === 'dark'
              ? COLORS.dark_disabled_text
              : COLORS.light_disabled_text
          }
        />
      </View>
    </View>
  );
};

export default ProfileInputTextView;

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
    marginLeft: 3
  },
  textinputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: rHeight(50),
    borderColor: COLORS.ligth_grey,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  textinputContainerEditing: {
    borderColor: COLORS.primary_skyblue,
  },
  countryCodeText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    color: COLORS.light_primary_text,
    fontSize: rHeight(17),
    marginRight: rWidth(12),
  },
  input: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(17),
    // height: rHeight(50),
    flex: 1,
    color: COLORS.light_primary_text,
  },
});
