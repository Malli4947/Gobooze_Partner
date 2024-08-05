import React from 'react';
import {Image, StyleSheet, Text, View,Linking} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import COLORS from '../constants/Colors';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import {CONST_STYLES} from '../constants/ConstStyles';
import {rHeight, rWidth} from '../constants/PixelSize';
import CallButton from './CallButton';
import {useColorScheme} from './ColorSchemeContext';
import CustomerDetailView from './Details/CustomerDetailView';
import OrderDetailExpandView from './Details/OrderDetailExpandView';

const OrderDetailsView = ({
  id,
  image,
  title,
  orderDetails,
  customerDetail,
  storeDetails,
  expandCustomerDetail,
  expandOrderDetail,
  expandStoreDetail,
  onPress,
  Onpresses,
  store
}) => {
  console.log(
    '💕 ~ file: OrderDetailsView.js:24 ~ orderDetails:====================================================',
    orderDetails,
  );
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const darkTextStyle = isDarkTheme && {color: COLORS.dark_primary_text};

  return (
    <View
      style={[
        styles.detailsContainer,
        CONST_STYLES.shadow,
        isDarkTheme && styles.dark_container,
      ]}>
      <TouchableOpacity style={styles.topView} onPress={onPress}>
        {/* {orderDetails.map(item,index)=>{}} */}
        <View style={styles.imgTextContainer}>
          <View
            style={[
              styles.imgContainer,
              isDarkTheme && {backgroundColor: COLORS.dark_disabled_background},
            ]}>
            <Image
              tintColor={isDarkTheme && COLORS.dark_primary_text}
              style={styles.img}
              source={image}
            />
          </View>
          <Text style={[styles.text, darkTextStyle]}>{title}</Text>
        </View>
        <TouchableOpacity onPress={onPress}>
          <Image
            tintColor={isDarkTheme && COLORS.dark_primary_text}
            style={styles.img}
            source={
              expandCustomerDetail || expandOrderDetail
                ? IMAGES.EXPAND
                : IMAGES.COLLAPSE
            }
          />
        </TouchableOpacity>
      </TouchableOpacity>
      {id == 1 && expandCustomerDetail && (
        <View>
          <View style={styles.expandedView}>
            <View
              style={[
                styles.seperator,
                isDarkTheme && {
                  backgroundColor: COLORS.dark_disabled_background,
                },
              ]}
            />
            <CustomerDetailView
              name={customerDetail.name}
              mobileNumber={customerDetail.mobileNum}
              orderId={customerDetail.orderId}
            />
          </View>
          {/* <CallButton
            onPress={() => {
              // Linking.openURL(`tel:${storeDetails.Phone}`);
            }}
          /> */}
          <CallButton onPress={Onpresses}/>
        </View>
      )}

      {id == 0 && expandOrderDetail && (
        <View>
          <OrderDetailExpandView orderDetails={orderDetails} />
        </View>
      )}

      {id == 2 && expandStoreDetail && (
        <View>
          <View
            style={[
              styles.seperator,
              isDarkTheme && {backgroundColor: COLORS.dark_disabled_background},
            ]}
          />
          <View style={{marginTop: 10}}>
            <View style={styles.userExpandCon}>
              {/* <Image
                tintColor={isDarkTheme && COLORS.dark_primary_text}
                style={styles.img}
                source={IMAGES.LOCATION}
              /> */}
              <View>
                <Text style={[styles.addressText, darkTextStyle]}>
                  Address:
                </Text>

                <Text
                  style={[styles.addressText, {width: '75%'}, darkTextStyle]}>
                  {orderDetails.order.store.storeAddress}
                </Text>
              </View>
            </View>
            {/* <CallButton /> */}
          </View>
        </View>
      )}
    </View>
  );
};

export default OrderDetailsView;

const styles = StyleSheet.create({
  dark_container: {
    backgroundColor: COLORS.dark_con,
    borderColor: COLORS.dark_disabled_background,
  },
  detailsContainer: {
    marginTop: rHeight(25),
    borderWidth: 1,
    borderRadius: 20,
    borderColor: COLORS.ligth_grey,
    marginHorizontal: rWidth(20),
    backgroundColor: '#FFF',
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: rWidth(20),
    alignItems: 'center',
  },
  imgTextContainer: {
    marginVertical: rHeight(15),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgContainer: {
    backgroundColor: '#F1F3F9',
    width: rWidth(50),
    height: rHeight(50),
    borderRadius: rHeight(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: rWidth(20),
    height: rHeight(20),
  },
  text: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
    paddingHorizontal: rWidth(15),
  },
  expandedView: {
    paddingBottom: rHeight(15),
    paddingHorizontal: rWidth(20),
  },
  seperator: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.ligth_grey,
    marginBottom: rHeight(5),
  },
  addressText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(16),
    paddingLeft: 6,
    lineHeight: 22,
  },
  userExpandCon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: rHeight(15),
    marginHorizontal: rWidth(10),
  },
});
