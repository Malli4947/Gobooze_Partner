import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  SafeAreaView,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import NavBarWithBackButton from '../components/NavBarWithBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import COLORS from '../constants/Colors';
import {rWidth, rHeight} from '../constants/PixelSize';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import Histroy from '../assets/Delivery history.svg';
import {useNavigation} from '@react-navigation/native';
import {BackHandler} from 'react-native';
const OrderHistory = ({orderRequests}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkTextStyle = isDarkTheme && {color: COLORS.dark_primary_text};
  const darkSep = isDarkTheme && {
    backgroundColor: COLORS.dark_theme_background,
  };
  const [filteredOrderData, setFilteredOrderData] = useState([]);
  const insets = useSafeAreaInsets();
  const [orderData, setOrderData] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    FetchOrderDetails();
  }, []);
  useEffect(() => {
    filterOrders();
  }, [orderId, orderData]);

  // const FetchOrderDetails = async () => {
  //   const combinedData = await AsyncStorage.getItem('USER_DATA');
  //   const [accessToken, userId] = combinedData?.split(':') ?? [];
  //   try {
  //     const fetchOrderDetails = await fetch(
  //       `https://api.gobooze.com.au/order/api/orders/get-delivery-user-completed-orders/${userId}`,
  //       {
  //         headers: {
  //           Authorization: `${accessToken}`,
  //         },
  //       },
  //     );
  //     const data = await fetchOrderDetails.json();
  //     setOrderData(data?.data.reverse());
  //   } catch (error) {
  //     console.log(error, 'error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const FetchOrderDetails = async () => {
    const combinedData = await AsyncStorage.getItem('USER_DATA');
    const [accessToken, userId] = combinedData?.split(':') ?? [];
    try {
      const fetchOrderDetails = await fetch(
        `https://api.gobooze.com.au/order/api/orders/get-delivery-user-completed-orders/${userId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );
      const data = await fetchOrderDetails.json();
      setOrderData(data?.data.reverse());
      setFilteredOrderData(data?.data.reverse());
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setLoading(false);
    }
  };
  const filterOrders = () => {
    if (orderId.trim() === '') {
      setFilteredOrderData(orderData);
    } else {
      const filteredData = orderData.filter(item =>
        item.order.sequence_number.includes(orderId.trim()),
      );
      setFilteredOrderData(filteredData);
    }
  };
  const formatDate = dateString => {
    const date = new Date(dateString);
    const options = {day: '2-digit', month: 'long', year: 'numeric'};
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('ProfileScreen');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup the event listener
  }, [navigation]);

  const IMAGE_URL = `https://gobooze-tst-new.s3.ap-southeast-2.amazonaws.com/goboozestore/`;

  return (
    <SafeAreaView
      style={[styles.container, isDarkTheme && styles.dark_container]}>
      <View style={{marginTop: insets.top, marginTop: 0}}>
        {/* <NavBarWithBackButton title={'Order History'} /> */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.menuContainer,
              isDarkTheme && {
                backgroundColor: '#23272F',
                borderColor: COLORS.dark_disabled_background,
              },
            ]}
            onPress={() => navigation.goBack()}>
            <Image
              tintColor={isDarkTheme && '#FFF'}
              resizeMode="contain"
              source={IMAGES.BACK}
              style={styles.menuImg}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerText,
              isDarkTheme && {
                backgroundColor: '#23272F',
                color: COLORS.light_con,
              },
            ]}>
            Order History
          </Text>
          {/* <View style={styles.dateContainer}>
            <Text   style={[
              styles.headerText1,
              isDarkTheme && {
                backgroundColor: '#23272F',
                color: COLORS.light_con,
              },
            ]}>Filter By:</Text>
    <TextInput 
      style={[
        styles.dateInput,
        isDarkTheme && {
          backgroundColor: '#23272F',
          color: COLORS.light_con,
        },
      ]}
      placeholder="OrderId"
      placeholderTextColor={isDarkTheme ? COLORS.light_con : '#999'}
      onChangeText={(text) => setOrderId(text)}
      value={orderId}
    />
   
  </View> */}
        </View>
      </View>
      <View style={styles.dateContainer}>
        <Text style={[styles.headerText1]}>Filter By:</Text>
        <TextInput
          style={[
            styles.dateInput,
            isDarkTheme && {
              backgroundColor: '#23272F',
              color: COLORS.light_con,
            },
          ]}
          placeholder="OrderId"
          placeholderTextColor={isDarkTheme ? COLORS.light_con : '#999'}
          onChangeText={text => setOrderId(text)}
          value={orderId}
        />
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color={
              isDarkTheme ? COLORS.dark_primary_text : COLORS.light_primary_text
            }
          />
        </View>
      ) : filteredOrderData.length === 0 ? (
        <View style={{alignItems: 'center'}}>
          <Histroy style={{marginTop: rHeight(200)}} />
          <Text
            style={[
              {
                color: '#000',
                fontSize: rWidth(16),
                fontFamily: GRAPHIK_FONT.MEDIUM,
                marginLeft: rWidth(10),
                marginTop: rHeight(30),
              },
              darkTextStyle,
            ]}>
            Haven't made any deliveries yet...
          </Text>
        </View>
      ) : (
        <ScrollView>
          {filteredOrderData.reverse().map((item, index) => (
            <View
              key={index}
              style={[styles.lcardCon, isDarkTheme && styles.dcardCon]}>
              <View
                style={[styles.lheaderCon, isDarkTheme && styles.dheaderCon]}>
                <View>
                  <Text style={[styles.ltext1, isDarkTheme && styles.dtext1]}>
                    ORDER PLACED
                  </Text>
                  <Text
                    style={[
                      styles.lorder_date,
                      isDarkTheme && styles.dorder_date,
                    ]}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>

                <View style={{marginLeft: rWidth(32)}}>
                  <Text style={[styles.ltext1, isDarkTheme && styles.dtext1]}>
                    ORDER ID
                  </Text>
                  <Text
                    style={[
                      styles.lorder_date,
                      isDarkTheme && styles.dorder_date,
                    ]}>
                    {item.order.sequence_number}
                  </Text>
                </View>
              </View>

              <>
                {item.order.order_Variants
                  .slice(0, 1)
                  .map((variant, productIndex) => (
                    <View
                      key={productIndex}
                      style={[
                        styles.lproductsCon,
                        isDarkTheme && styles.dproductsCon,
                      ]}>
                      <View style={styles.lproductsRowCon}>
                        <Text
                          style={[
                            styles.lqtyText,
                            isDarkTheme && styles.dqtyText,
                          ]}>
                          {variant.orderQuantity}x
                        </Text>

                        <FastImage
                          source={{
                            uri: `${IMAGE_URL}${variant.variantImage}`,
                          }}
                          resizeMode="contain"
                          style={styles.product_Image}
                        />
                        <View style={{marginLeft: rWidth(12)}}>
                          <Text
                            style={[
                              styles.lbrandText,
                              isDarkTheme && styles.dbrandText,
                            ]}>
                            {variant.quantity}-Pack,{' '}
                          </Text>
                          <Text
                            style={[
                              styles.lnameText,
                              isDarkTheme && styles.dnameText,
                            ]}>
                            {variant.variantName}
                          </Text>
                          <Text
                            style={[
                              styles.lpriceText,
                              isDarkTheme && styles.dpriceText,
                            ]}>
                            ${variant.finalSellingPrice}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
              </>

              {showAllProducts === item._id && (
                <>
                  {item.order.order_Variants.slice(1).map((variant, index2) => (
                    <View
                      key={index2}
                      style={[
                        styles.lproductsCon,
                        isDarkTheme && styles.dproductsCon,
                      ]}>
                      <View style={styles.lproductsRowCon}>
                        <Text
                          style={[
                            styles.lqtyText,
                            isDarkTheme && styles.dqtyText,
                          ]}>
                          {variant.orderQuantity}x
                        </Text>
                        <FastImage
                          source={{
                            uri: `https://gobooze-tst-new.s3.ap-southeast-2.amazonaws.com/goboozestore/
${variant.variantImage}`,
                          }}
                          resizeMode="contain"
                          style={styles.product_Image}
                        />
                        <View style={{marginLeft: rWidth(12)}}>
                          <Text
                            style={[
                              styles.lbrandText,
                              isDarkTheme && styles.dbrandText,
                            ]}>
                            {variant.quantity}-Pack,{' '}
                          </Text>
                          <Text
                            style={[
                              styles.lnameText,
                              isDarkTheme && styles.dnameText,
                            ]}>
                            {variant.variantName}
                          </Text>
                          <Text
                            style={[
                              styles.lpriceText,
                              isDarkTheme && styles.dpriceText,
                            ]}>
                            ${variant.finalSellingPrice}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </>
              )}

              {item.order.order_Variants.length > 1 && (
                <TouchableOpacity
                  onPress={() => {
                    if (item._id === showAllProducts) {
                      setShowAllProducts(0);
                    } else {
                      setShowAllProducts(item._id);
                    }
                  }}
                  style={{}}>
                  <Text style={[styles.moreText]}>
                    {showAllProducts === item._id
                      ? `-${item.order.order_Variants.length - 1} items`
                      : `+${item.order.order_Variants.length - 1} items`}
                  </Text>
                </TouchableOpacity>
              )}
              <View
                style={[
                  styles.dummyView,
                  isDarkTheme && {
                    backgroundColor: COLORS.dark_disabled_background,
                  },
                ]}
              />
              <View style={[styles.rowCon]}>
                <Text
                  style={[styles.lleftText, isDarkTheme && styles.dleftText]}>
                  Customer Name:
                </Text>
                <Text
                  style={[styles.lRightText, isDarkTheme && styles.dRightText]}>
                  {item.order.address.first_name ===
                  item.order.address.first_name
                    ? item.order.address.first_name
                    : `${item.order.address.first_name} ${item.order.address.last_name}`}
                </Text>
              </View>
            </View>
          ))}
          <View style={{height: rHeight(50)}} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default OrderHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  dateContainer: {
    flexDirection: 'row',

    marginTop: rHeight(10),
    alignItems: 'center',
    marginLeft: rWidth(185),
  },
  dateInput: {
    borderWidth: 1,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    color: '#000',
    borderColor: COLORS.ligth_grey,
    borderRadius: 16,
    paddingHorizontal: rHeight(8),
    paddingVertical: rWidth(5),
    marginLeft: rWidth(5),
    width: rWidth(120),
    fontSize: rWidth(12),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  lcardCon: {
    paddingBottom: 16,
    backgroundColor: COLORS.light_con,
    marginTop: rHeight(8),
    borderWidth: 1,
    marginLeft: rWidth(16),
    marginRight: rWidth(16),
    borderRadius: 16,
    elevation: 1,
    borderColor: COLORS.light_disabled_background,
  },
  dcardCon: {
    backgroundColor: COLORS.dark_con,
    borderColor: COLORS.dark_disabled_background,
  },
  lheaderCon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F9',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  dheaderCon: {
    backgroundColor: '#1B1F27',
  },
  ltext1: {
    color: COLORS.light_disabled_text,
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(12),
  },
  dtext1: {
    color: COLORS.dark_disabled_text,
  },
  lorder_date: {
    color: COLORS.light_secondary_text,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(14),
    marginTop: rHeight(4),
  },
  dorder_date: {
    color: COLORS.dark_secondary_text,
  },
  lproductsCon: {
    padding: 16,
  },
  dproductsCon: {},
  lproductsRowCon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  lqtyText: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(14),
  },
  dqtyText: {
    color: COLORS.dark_primary_text,
  },
  product_Image: {
    width: rWidth(53),
    height: rHeight(78),
    marginLeft: rWidth(12),
  },
  lbrandText: {
    color: COLORS.light_secondary_text,
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(12),
  },
  dbrandText: {
    color: COLORS.dark_secondary_text,
  },
  lnameText: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(14),
    width: rWidth(200),
    marginTop: rHeight(4),
  },
  dnameText: {
    color: COLORS.dark_primary_text,
  },
  lpriceText: {
    color: '#D3178A',
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(14),
    marginTop: rHeight(4),
  },
  dpriceText: {
    color: '#D3178A',
  },
  moreText: {
    color: '#0162DD',
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(14),
    textAlign: 'right',
    marginRight: 16,
  },
  dummyView: {
    marginLeft: rWidth(16),
    marginRight: rWidth(16),
    backgroundColor: COLORS.light_disabled_background,
    height: 1.3,
    marginVertical: rHeight(12),
  },
  rowCon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: rWidth(16),
  },
  lleftText: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rWidth(14),
  },
  dleftText: {
    color: COLORS.dark_primary_text,
  },
  lRightText: {
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(14),
    marginLeft: rWidth(8),
  },
  dRightText: {
    color: COLORS.dark_primary_text,
  },
  statusCon: {
    paddingLeft: rWidth(8),
    paddingRight: rWidth(8),
    paddingTop: rHeight(3),
    paddingBottom: rHeight(3),
    backgroundColor: '#F0F6FF',
    borderRadius: 99,
    marginLeft: rWidth(8),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: rWidth(16),
    borderBottomColor: COLORS.light_disabled_background,
    borderBottomWidth: 1,
    paddingBottom: rHeight(16),
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
    width: rHeight(30),
    height: rHeight(30),
  },
  headerText: {
    fontFamily: GRAPHIK_FONT.BOLD,
    color: '#000',
    paddingLeft: rWidth(16),
    fontSize: rWidth(14),
  },
  headerText1: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    color: COLORS.primary_pink,
    paddingLeft: rWidth(1),
    fontSize: rWidth(13),
  },
});
