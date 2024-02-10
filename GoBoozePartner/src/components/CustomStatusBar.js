import * as React from 'react';
import {View, StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import COLORS from '../constants/Colors';
import {useColorScheme} from './ColorSchemeContext';

const CustomStatusBar = ({showHideTransition = 'none', backgroundColor}) => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const dynamicBackgroundColor =
    backgroundColor ||
    (colorScheme == 'dark'
      ? COLORS.dark_theme_background
      : COLORS.light_theme_background);

  return (
    <View style={{height: insets.top - 5}}>
      <StatusBar
        animated={true}
        backgroundColor={dynamicBackgroundColor}
        barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
        showHideTransition={showHideTransition}
      />
    </View>
  );
};

export default CustomStatusBar;
