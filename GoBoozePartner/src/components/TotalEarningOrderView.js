import {View, StyleSheet, Image, Text} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useColorScheme} from './ColorSchemeContext';

const TotalEarningOrderView = ({title, value}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  return (
    <View
      style={[
        styles.earningContainer,
        isDarkTheme && {borderColor: COLORS.dark_disabled_background},
      ]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          tintColor={isDarkTheme && '#FFF'}
          style={styles.cubeImg}
          source={IMAGES.CUBE}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.totalOrderText,
            isDarkTheme && {color: COLORS.dark_primary_text},
          ]}>
          {title}
        </Text>
      </View>
      <Text
        style={[
          styles.earningValue,
          isDarkTheme && {color: COLORS.dark_primary_text},
        ]}>
        {value}
      </Text>
    </View>
  );
};

export default TotalEarningOrderView;

const styles = StyleSheet.create({
  earningContainer: {
    width: '48%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.ligth_grey,
    padding: 15,
    // paddingLeft: 2,
  },
  cubeImg: {
    width: rWidth(20),
    height: rHeight(20),
  },
  totalOrderText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(15),
    paddingLeft: 10,
    color: COLORS.light_primary_text,
  },
  earningValue: {
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rHeight(22),
    marginTop: rHeight(10),
    color: COLORS.light_primary_text,
    textAlign:'center'
  },
});
