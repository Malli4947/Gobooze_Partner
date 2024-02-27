import * as React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../constants/Colors';
import {useColorScheme} from './ColorSchemeContext';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import GBSegmentControl from './GBSegmentControl';

const screenWidth = Dimensions.get('screen').width * 0.6;

const OrderNavigationBar = ({onPress}) => {
  const [onlineOfflineIndex, setOnlineOfflineIndex] = React.useState(0);
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  const Badge = () => {
    return (
      <View style={styles.badgeView}>
        <Text style={styles.badgeText}>5</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={[
          styles.menuContainer,
          isDarkTheme && {
            backgroundColor: '#23272F',
            borderColor: COLORS.dark_disabled_background,
          },
        ]}
        onPress={onPress}>
        <Badge />
        <Image
          tintColor={isDarkTheme && '#FFF'}
          resizeMode="contain"
          source={IMAGES.MENU}
          style={styles.menuImg}
        />
      </TouchableOpacity>
      <View style={{width: rWidth(35)}} />

      <GBSegmentControl
        width={screenWidth}
        tintColor={onlineOfflineIndex === 0 ? '#099A6A' : COLORS.red_error}
        segmentArray={['Online', 'Offline']}
        selectedIndex={onlineOfflineIndex}
        onValueChange={index => setOnlineOfflineIndex(index)}
      />
    </View>
  );
};

export default OrderNavigationBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: rWidth(15),
  },
  menuContainer: {
    width: rHeight(50),
    height: rHeight(50),
    borderRadius: rHeight(25),
    borderColor: COLORS.ligth_grey,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuImg: {
    width: rHeight(22),
    height: rHeight(22),
  },
  badgeView: {
    width: rHeight(20),
    height: rHeight(20),
    borderRadius: rHeight(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.red_error,
    position: 'absolute',
    top: -5,
    right: -8,
  },
  badgeText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(10),
    color: '#FFF',
  },
});
