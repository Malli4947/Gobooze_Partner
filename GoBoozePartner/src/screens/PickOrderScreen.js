import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import COLORS from '../constants/Colors';
import {rHeight, rWidth} from '../constants/PixelSize';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import NavBarWithBackButton from '../components/NavBarWithBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomSlideButton from '../components/SlideButton/CustomSlideButton';
import OrderDetailsView from '../components/OrderDetailsView';
import PickOrderNowAlert from './PickOrderNowAlert';

const orders = [
  {
    id: 0,
    quantity: 1,
    image: '',
    name: 'VICKERS GIN',
    description: 'Vickers London Dry Gin 37.0% 700ml',
  },
  {
    id: 1,
    quantity: 2,
    image: '',
    name: 'CARLTON',
    description: 'Carlton Draught 4.6% 750mL 3pack',
  },
];

// const detailsData = [{id: 0, title: 'Order Details'}]

const PickOrderScreen = props => {
  const [isOrderReady, setIsOrderReady] = useState(false);
  const [expandOrderDetailView, setExpandOrderDetailView] = useState(false);
  const [expandCustomerDetailView, setExpandCustomerDetailView] =
    useState(false);
  let orderNumber = '4286690449';
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkTextStyle = isDarkTheme && {color: COLORS.dark_primary_text};
  const slideBtnColor = isDarkTheme ? '#FFFFFF99' : '#1D2433A6';
  const darkSep = isDarkTheme && {
    backgroundColor: COLORS.dark_theme_background,
  };

  return (
    <View style={[styles.container, isDarkTheme && styles.dark_container]}>
      <PickOrderNowAlert modalVisible={false} />
      <View style={{marginTop: insets.top}}>
        <NavBarWithBackButton title={'Pickup Order'} />
        <View style={[styles.seperator, darkSep]} />
      </View>

      {/* ---------------- BOTTOM CONTAINER ---------------- */}
      <ScrollView>
        <View
          style={[
            styles.timerConatiner,
            isDarkTheme && {backgroundColor: COLORS.dark_theme_background},
          ]}>
          <Image
            tintColor={isDarkTheme && COLORS.blue_dark}
            style={styles.timerImg}
            source={IMAGES.TIMER}
          />
          <Text
            style={[
              styles.timerText,
              isDarkTheme && {color: COLORS.blue_dark},
            ]}>
            {isOrderReady ? 'Pick Order Now' : `Order is ready in ${4} mins`}
          </Text>
        </View>
        <View style={[styles.seperator, darkSep]} />
        <Text style={[styles.orderidStaticText, darkTextStyle]}>ORDER ID</Text>
        <Text style={[styles.orderNumText, darkTextStyle]}>
          {orderNumber.slice(0, orderNumber.length - 4)}
          <Text style={{fontFamily: GRAPHIK_FONT.SEMIBOLD}}>
            {orderNumber.slice(-4)}
          </Text>
        </Text>
        <View style={{paddingBottom: 20}}>
          <FlatList
            scrollEnabled={false}
            data={[{}, {}, {}]}
            renderItem={({item, index}) => {
              if (index === 0) {
                return (
                  <OrderDetailsView
                    id={0}
                    expandOrderDetail={expandOrderDetailView}
                    image={IMAGES.BOX}
                    title={'Order Details'}
                    orderDetails={orders}
                    onPress={() => setExpandOrderDetailView(!expandOrderDetailView)}
                  />
                );
              } else if (index == 1) {
                return (
                  <OrderDetailsView
                    id={1}
                    expandCustomerDetail={expandCustomerDetailView}
                    image={IMAGES.CUSTOMER}
                    title={'Customer Details'}
                    customerDetail={{
                      name: 'Rahul Singh',
                      mobileNum: '8866157629',
                      orderId: '4286690449',
                    }}
                    onPress={() => setExpandCustomerDetailView(!expandCustomerDetailView)}
                  />
                );
              } else {
                return (
                  <OrderDetailsView
                    id={2}
                    image={IMAGES.SHOP}
                    title={'Store Details'}
                    onPress={() => {
                      console.log('-----2-----');
                    }}
                  />
                );
              }
            }}
          />
        </View>
      </ScrollView>

      {/* ------------- Bottom slide button ----------- */}
      <View style={styles.slideBtnContainer}>
        <CustomSlideButton
          title="Reached Pickup Location"
          confirmedText="Reached"
          disabled={isOrderReady}
          imgColor={isOrderReady == false ? slideBtnColor : undefined}
          titleStyle={isOrderReady == false ? slideBtnColor : undefined}
          onReachedToEnd={() => props.navigation.navigate('OrderPick')}
          thumbColor={
            isOrderReady == false
              ? isDarkTheme
                ? '#1B1F27'
                : '#FFF'
              : undefined
          }
          containerColor={
            isOrderReady == false
              ? isDarkTheme
                ? COLORS.dark_disabled_background
                : COLORS.ligth_grey
              : undefined
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  dark_container: {
    backgroundColor: COLORS.dark_con,
  },
  seperator: {
    backgroundColor: COLORS.light_theme_background,
    height: rHeight(9),
    width: '100%',
    marginTop: rHeight(15),
  },
  orderidStaticText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(13),
    marginTop: rHeight(20),
    marginBottom: rHeight(15),
    alignSelf: 'center',
    color: '#1D2433A6',
  },
  timerConatiner: {
    backgroundColor: '#F0F6FF',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: rWidth(20),
    paddingVertical: rHeight(14),
    borderRadius: rHeight(10),
    marginTop: rHeight(15),
  },
  timerImg: {
    width: rWidth(20),
    height: rHeight(20),
  },
  timerText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
    paddingLeft: rWidth(8),
    color: COLORS.blue,
  },
  orderNumText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(36),
    paddingLeft: 5,
    color: COLORS.light_primary_text,
    alignSelf: 'center',
    marginBottom: rHeight(10),
  },
  slideBtnContainer: {
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
  },
});

export default PickOrderScreen;
