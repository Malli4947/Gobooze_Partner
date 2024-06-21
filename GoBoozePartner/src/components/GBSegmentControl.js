import React from 'react';
import COLORS from '../constants/Colors';
import {useColorScheme} from './ColorSchemeContext';
import CustomSegmentedControl from './CustomSegmentControl';
import {View} from 'react-native';

const GBSegmentControl = props => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const {
    segmentArray,
    selectedIndex,
    onValueChange,
    inactiveBgColor,
    inactiveFont,
    activeFont,
    tintColor,
    width,
    segmentBorderRadius,
  } = props;

  return (
    <View style={{}}>
      <CustomSegmentedControl
        tabs={segmentArray}
        onChange={onValueChange}
        currentIndex={selectedIndex}
        segmentWidth={width ? width : 250}
        segmentBorderRadius={segmentBorderRadius ? segmentBorderRadius : 30}
        segmentedControlBackgroundColor={
          inactiveBgColor
            ? inactiveBgColor
            : isDarkTheme
            ? '#00000070'
            : '#00000015'
        }
        activeSegmentBackgroundColor={tintColor ? tintColor : COLORS.red_error}
        activeTextColor={
          activeFont ? activeFont : isDarkTheme ? '#FFFFFF' : '#FFF'
        }
        textColor={
          inactiveFont ? inactiveFont : isDarkTheme ? '#FFFFFFBF' : '#1D2433CC'
        }
      />
    </View>
  );
};

export default GBSegmentControl;
