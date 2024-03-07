import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useColorScheme} from '../components/ColorSchemeContext';
import CustomButton from '../components/CustomButton';
import EarningPickDropDetailView from '../components/EarningPickDropDetailView';
import NavBarWithBackButton from '../components/NavBarWithBackButton';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT} from '../constants/Constant';
import {rHeight, rWidth} from '../constants/PixelSize';
import NewOrderAlertScreen from './NewOrderAlertScreen';

const TripSummaryScreen = props => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDarkTheme = colorScheme === 'dark';
  const darkSep = isDarkTheme && {backgroundColor: '#1B1F27'};

  return (
    <View style={[styles.container, isDarkTheme && styles.darkCon]}>
      {/* <NewOrderAlertScreen modalVisible={true} /> */}
      <View style={{marginTop: insets.top}}>
        <NavBarWithBackButton title={'Trip Summary'} />
        <View style={[styles.seperator, darkSep]} />
      </View>
      <View>
        <View style={{alignItems: 'center', marginVertical: 30}}>
          <Text style={[styles.heading, isDarkTheme && {color: '#FFFFFF'}]}>
            Great job! You did a perfect trip
          </Text>
        </View>

        <EarningPickDropDetailView
          isTripSum={true}
          earning={{key: 'Trip Earning: ', value: '$5.89'}}
          bottomLeft={{key: 'Drop Dest.: ', value: '2.5km'}}
          bottomRight={{key: 'TIme: ', value: '28mins'}}
        />
      </View>

      <View
        style={[
          styles.btnContainer,
          isDarkTheme && {
            backgroundColor: COLORS.dark_con,
            borderTopColor: '#1B1F27',
          },
        ]}>
        <CustomButton
          buttonText="Get Next Order"
          buttonStyle={isDarkTheme && {backgroundColor: COLORS.pink_light}}
        />
      </View>
    </View>
  );
};

export default TripSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  darkCon: {
    backgroundColor: COLORS.dark_con,
  },
  seperator: {
    backgroundColor: COLORS.light_theme_background,
    height: rHeight(9),
    width: '100%',
    marginTop: rHeight(15),
  },
  heading: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(18),
    color: COLORS.light_primary_text,
  },
  dropContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(14),
  },
  desc: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
  },
  btnContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: rWidth(40),
    paddingHorizontal: rWidth(20),
    borderTopWidth: 1,
    borderTopColor: COLORS.ligth_grey,
  },
});
