import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import { useColorScheme } from './ColorSchemeContext';

const TodayProgressView = ({title, value}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  return (
    <View style={styles.progressContainer}>
      <Text style={[styles.totalOrderText, isDarkTheme && {color: '#FFFFFF'}]}>{title}</Text>
      <Text style={styles.earningValue}>{value}</Text>
      <TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.viewText}>View</Text>
          <Image style={styles.forwardImg} source={IMAGES.FORWARD} resizeMode="contain" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TodayProgressView;

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6
  },
  cubeImg: {
    width: rWidth(20),
    height: rHeight(20),
  },
  totalOrderText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(14),
    lineHeight: 22,
    textAlign: 'center'
  },
  earningValue: {
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rHeight(24),
    marginVertical: rHeight(15),
    color: COLORS.blue,
  },
  viewText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(14),
    color: COLORS.primary_pink,
    alignSelf: 'center',
    paddingHorizontal: 7
  },
  forwardImg: {
    width: rWidth(15),
    height: rHeight(15),
  }
});
