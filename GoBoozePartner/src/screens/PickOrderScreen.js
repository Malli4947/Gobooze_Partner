import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  FlatList,
  Alert,
  Linking
} from 'react-native';
import React, {useState,useEffect} from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import COLORS from '../constants/Colors';
import {rHeight, rWidth} from '../constants/PixelSize';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import NavBarWithBackButton from '../components/NavBarWithBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomSlideButton from '../components/SlideButton/CustomSlideButton';
import OrderDetailsView from '../components/OrderDetailsView';
import PickOrderNowAlert from './PickOrderNowAlert';
import NewSlideButton from '../components/NewSlideButton';
import {useNavigation} from '@react-navigation/native';
import updateOrder from '../constants/statusUpdate';
import { BackHandler } from 'react-native';
// const detailsData = [{id: 0, title: 'Order Details'}]

const PickOrderScreen = ({route}) => {
  const OrderDetails = route.params.orderDetails;

  const orders = OrderDetails.order.order_Variants;
console.log(OrderDetails,'OrderDetails=========================')
  const storeDetails = route.params.orderDetails.order.store;

  const [isOrderReady, setIsOrderReady] = useState(false);
  const [expandOrderDetailView, setExpandOrderDetailView] = useState(false);
  const [expandCustomerDetailView, setExpandCustomerDetailView] =
    useState(false);
  const [expandStoreDetailsView, setExpandStoreDetailsView] = useState(false);
  let orderNumber = '4286690449';
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkTextStyle = isDarkTheme && {color: COLORS.dark_primary_text};
  const slideBtnColor = isDarkTheme ? '#FFFFFF99' : '#1D2433A6';
  const darkSep = isDarkTheme && {
    backgroundColor: COLORS.dark_theme_background,
  };
  const navigation = useNavigation();

  const handleUpdateOrder = async () => {
    try {
      await updateOrder(OrderDetails.order_id, 'on-the-way');
    } catch (e) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };
  useEffect(() => {
    const backAction = () => {
     
      navigation.navigate('Home');
      return true; 
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup the event listener
  }, [navigation]);  
  return (
    <View style={[styles.container, isDarkTheme && styles.dark_container]}>
      <PickOrderNowAlert modalVisible={false} />
      <View style={{marginTop: insets.top}}>
        <NavBarWithBackButton
          title={'Pickup Order'}
         
        />
        <View style={[styles.seperator, darkSep]} />
      </View>

      {/* ---------------- BOTTOM CONTAINER ---------------- */}
      <ScrollView>
        <View
          style={[
            styles.timerConatiner,
            isDarkTheme && {backgroundColor: COLORS.dark_theme_background},
          ]}>
          {/* <View
            style={[
              styles.timerContainer,
              isDarkTheme && {backgroundColor: COLORS.blue_dark},
            ]}>
            <Text style={[styles.timerText, {color: '#FFF'}]}>2:59</Text>
          </View> */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
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
        </View>
        <View style={[styles.seperator, darkSep]} />
        <Text style={[styles.orderidStaticText, darkTextStyle]}>ORDER ID</Text>
        <Text style={[styles.orderNumText, darkTextStyle]}>
        {OrderDetails.order.sequence_number}
          {/* {OrderDetails.order_id.slice(0, orderNumber.length - 4)}-
          <Text style={{fontFamily: GRAPHIK_FONT.SEMIBOLD}}>
            {OrderDetails.order_id.slice(-5)}
          </Text> */}
        </Text>
        <View style={{paddingBottom: 20}}>
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={{paddingBottom: 5}}
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
                    onPress={() =>
                      setExpandOrderDetailView(!expandOrderDetailView)
                    }
                  />
                );
              } else if (index == 1) {
                return (
                  <OrderDetailsView
                    id={1}
                    store={true}
                    expandCustomerDetail={expandCustomerDetailView}
                    image={IMAGES.CUSTOMER}
                    title={'Customer Details'}
                    orderDetails={OrderDetails}
                    customerDetail={{
                      name: `${OrderDetails.order.address.first_name}`,
                      mobileNum: `${OrderDetails.order.address.addressPhoneNumber}`,
                    
                      // orderId: `#${OrderDetails.order_id.slice(
                      //   0,
                      //   5,
                      // )}-${OrderDetails.order_id.slice(-5)}`,
                      orderId:`${OrderDetails.order.sequence_number}`,

                    }}
                    onPress={() =>
                      setExpandCustomerDetailView(!expandCustomerDetailView)

                    }
                    Onpresses={()=>{
                      Linking.openURL(`tel:${OrderDetails.order.store.phone}`)
                    }}
                  />
                );
              } else {
                return (
                  <OrderDetailsView
                    id={2}
                    image={IMAGES.SHOP}
                    title={'Store Details'}
                    expandStoreDetail={expandStoreDetailsView}
                    orderDetails={OrderDetails}
                    onPress={() => {
                      setExpandStoreDetailsView(!expandStoreDetailsView);

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
      <View
        style={[
          styles.slideBtnContainer,
          isDarkTheme && {backgroundColor: COLORS.dark_con},
        ]}>
        <NewSlideButton
          title={`Okay, Pick the Order`}
          navigationScreen={'ReachMapDrop'}
          onComplete={handleUpdateOrder}
          orderData={OrderDetails}
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
    justifyContent: 'space-evenly',
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
    marginRight: rWidth(8),
  },
  timerText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
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
    width: '100%',
    backgroundColor: '#FFF',
  },
  timerContainer: {
    backgroundColor: COLORS.blue,
    paddingVertical: rHeight(5),
    paddingHorizontal: rWidth(8),
    borderRadius: 13,
  },
});

export default PickOrderScreen;
