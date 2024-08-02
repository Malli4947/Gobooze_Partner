import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {GRAPHIK_FONT} from '../constants/Constant';

const shadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.23,
  shadowRadius: 2.62,
  elevation: 4,
};

const CustomSegmentedControl = props => {
  const translateValue = (props.segmentWidth - 4) / props?.tabs?.length;
  const [tabTranslate, setTabTranslate] = React.useState(new Animated.Value(0));

  // useCallback with an empty array as input, which will call inner lambda only once and memoize the reference for future calls
  const memoizedTabPressCallback = React.useCallback(index => {
    if (!props.disabledSegments.includes(index)) {
      props?.onChange(index);
    }
  }, [props.disabledSegments]);

  useEffect(() => {
    // Animating the active index based on the current index
    Animated.spring(tabTranslate, {
      toValue: props?.currentIndex * translateValue,
      stiffness: 180,
      damping: 20,
      mass: 1,
      useNativeDriver: true,
    }).start();
  }, [props?.currentIndex]);

  return (
    <Animated.View
      style={[
        styles.segmentedControlWrapper,
        {
          width: props?.segmentWidth,
          borderRadius: props.segmentBorderRadius,
          backgroundColor: props?.segmentedControlBackgroundColor,
          paddingVertical: props?.paddingVertical,
        },
      ]}>
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFill,
            position: 'absolute',
            width: (props.segmentWidth - 4) / props?.tabs?.length,
            top: 0,
            marginVertical: 2,
            marginHorizontal: 2,
            backgroundColor: props?.activeSegmentBackgroundColor,
            borderRadius: props.segmentBorderRadius,
            ...shadow,
          },
          {
            transform: [
              {
                translateX: tabTranslate,
              },
            ],
          },
        ]}></Animated.View>
      {props?.tabs.map((tab, index) => {
        const isCurrentIndex = props?.currentIndex === index;
        const isDisabled = props.disabledSegments.includes(index);
        return (
          <TouchableOpacity
            key={index}
            style={[styles.textWrapper, isDisabled && styles.disabled]}
            onPress={() => memoizedTabPressCallback(index)}
            activeOpacity={isDisabled ? 1 : 0.7}
            disabled={isDisabled}>
            <Text
              numberOfLines={1}
              style={[
                styles.textStyles,
                {color: props?.textColor},
                isCurrentIndex && {color: props?.activeTextColor},
                isDisabled && {color: 'gray'},
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  segmentedControlWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    marginVertical: 0,
  },
  textWrapper: {
    flex: 1,
    elevation: 9,
    paddingHorizontal: 5,
  },
  textStyles: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: GRAPHIK_FONT.MEDIUM,
  },
  disabled: {
    opacity: 0.5,
  },
});

CustomSegmentedControl.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  currentIndex: PropTypes.number.isRequired,
  segmentedControlBackgroundColor: PropTypes.string,
  activeSegmentBackgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  activeTextColor: PropTypes.string,
  paddingVertical: PropTypes.number,
  segmentWidth: PropTypes.number,
  segmentBorderRadius: PropTypes.number,
  disabledSegments: PropTypes.arrayOf(PropTypes.number),
};

CustomSegmentedControl.defaultProps = {
  tabs: [],
  onChange: () => {},
  currentIndex: 0,
  segmentedControlBackgroundColor: '#E5E5EA',
  activeSegmentBackgroundColor: 'white',
  textColor: 'black',
  activeTextColor: 'black',
  paddingVertical: 14,
  segmentWidth: 250,
  segmentBorderRadius: 30,
  disabledSegments: [],
};

export default CustomSegmentedControl;
