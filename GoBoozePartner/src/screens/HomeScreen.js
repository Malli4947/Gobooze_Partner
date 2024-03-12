import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import COLORS from '../constants/Colors';
import {rHeight, rWidth} from '../constants/PixelSize';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import OrderNavigationBar from '../components/OrderNavigationBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TotalEarningOrderView from '../components/TotalEarningOrderView';
import TodayProgressView from '../components/TodayProgressView';
import GBSegmentControl from '../components/GBSegmentControl';
import NewOrderAlertScreen from './NewOrderAlertScreen';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import CustomStatusBar from '../components/CustomStatusBar';

const screenWidth = Dimensions.get('screen').width - 30;

const HomeScreen = props => {
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [insignSelectedIndex, setInsightSelectedIndex] = useState(0);

  const isDarkTheme = colorScheme === 'dark';
  const darkSeperator = isDarkTheme && {
    backgroundColor: COLORS.dark_theme_background,
  };
  const darkVerticalSeperator = isDarkTheme && {
    backgroundColor: COLORS.dark_disabled_background,
  };

  return (
    <View style={[styles.container, isDarkTheme && styles.dark_container]}>
      <NewOrderAlertScreen
        modalVisible={showNewOrderModal}
        dismissModal={() => setShowNewOrderModal(!showNewOrderModal)}
        onReachedToEnd={() => props.navigation.navigate('ReachPickup')}
        denyClick={() => {
          setShowNewOrderModal(false);
        }}
      />
      <CustomStatusBar
        backgroundColor={isDarkTheme ? COLORS.dark_con : COLORS.light_con}
      />
      {/* marginTop: insets.top */}
      <View style={{}}>
        <OrderNavigationBar />
        <View style={[styles.seperator, darkSeperator]} />
      </View>
      <ScrollView>
        {/* ------------- total arning and order view  ------------- */}
        <View style={styles.horizontalMargin}>
          <Text
            onPress={() => {
              props.navigation.navigate('ReachPickup');
            }}
            style={[
              styles.totalEarningText,
              isDarkTheme && {color: '#FFFFFF'},
            ]}>
            Total Earning & Orders
          </Text>
          <Pressable
            onPress={() => {
              setShowNewOrderModal(true);
            }}
            style={styles.earningOrderContainer}>
            <TotalEarningOrderView title="Total Orders" value="23" />
            <TotalEarningOrderView title="Total Earning" value="$1.56k" />
          </Pressable>
        </View>
        <View style={[styles.seperator, darkSeperator]} />

        {/* ------------- today's progress view  ------------- */}
        <View style={styles.horizontalMargin}>
          <Text
            style={[
              styles.totalEarningText,
              isDarkTheme && {color: '#FFFFFF'},
            ]}>
            Today’s Progress
          </Text>
          <View style={styles.earningOrderContainer}>
            <TodayProgressView title={`Today’s\nEarning`} value="$59.99" />
            <View style={[styles.verticalSeperator, darkVerticalSeperator]} />
            <TodayProgressView title={`Today’s\nOrders`} value="23" />
            <View style={[styles.verticalSeperator, darkVerticalSeperator]} />
            <TodayProgressView title={`Today’s\nLogIn Hrs`} value="$1.56k" />
          </View>
        </View>
        <View style={[styles.seperator, darkSeperator]} />

        {/* ------------- total arning and order view  ------------- */}
        <View style={styles.horizontalMargin}>
          <Text
            style={[
              styles.totalEarningText,
              {marginBottom: 20},
              isDarkTheme && {color: '#FFFFFF'},
            ]}>
            Your Insights
          </Text>
          <GBSegmentControl
            width={screenWidth}
            segmentBorderRadius={10}
            inactiveBgColor={isDarkTheme && '#00000070'}
            tintColor={isDarkTheme ? '#3F444D' : '#FFF'}
            inactiveFont={isDarkTheme && '#FFFFFFBF'}
            activeFont={isDarkTheme ? '#FFF' : COLORS.light_primary_text}
            segmentArray={['Orders', 'Revenue']}
            selectedIndex={insignSelectedIndex}
            onValueChange={index => setInsightSelectedIndex(index)}
          />
        </View>
        <TouchableWithoutFeedback
          style={{width: 100, height: 100}}
          onPress={() => setShowNewOrderModal(true)}></TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  dark_container: {
    backgroundColor: COLORS.dark_con,
  },
  seperator: {
    backgroundColor: COLORS.light_theme_background,
    height: rHeight(9),
    width: '100%',
    marginTop: rHeight(6),
  },
  totalEarningText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(20),
  },
  horizontalMargin: {
    marginHorizontal: 15,
    marginVertical: rHeight(15),
  },
  earningOrderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: rHeight(20),
    alignItems: 'center',
  },
  verticalSeperator: {
    width: 2,
    height: '70%',
    backgroundColor: '#F1F3F9',
  },
});

export default HomeScreen;
