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

const screenWidth = Dimensions.get('screen').width * 0.6;

const NavBarWithBackButton = ({onPress, title, backDisabled}) => {
  const [onlineOfflineIndex, setOnlineOfflineIndex] = React.useState(0);
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  return (
    <View style={[styles.container]}>
      {true && (
        <TouchableOpacity
          style={[
            styles.menuContainer,
            isDarkTheme && {
              backgroundColor: '#23272F',
              borderColor: COLORS.dark_disabled_background,
            },
          ]}
          onPress={onPress}>
          <Image
            tintColor={isDarkTheme && '#FFF'}
            resizeMode="contain"
            source={IMAGES.BACK}
            style={styles.menuImg}
          />
        </TouchableOpacity>
      )}
      <View style={{width: rWidth(15)}} />

      <Text style={[styles.title, isDarkTheme && {color: '#FFFFFF'}]}>
        {title}
      </Text>
    </View>
  );
};

export default NavBarWithBackButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: rWidth(15),
    marginVertical: rHeight(10),
  },
  menuContainer: {
    width: rHeight(44),
    height: rHeight(44),
    borderRadius: rHeight(22),
    borderColor: COLORS.ligth_grey,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuImg: {
    width: rHeight(22),
    height: rHeight(22),
  },
  title: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(19),
    color: COLORS.light_primary_text,
  },
});
