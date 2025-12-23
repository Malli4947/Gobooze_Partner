import React, { useState, Suspense, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
  Alert,
} from 'react-native';
import { useColorScheme } from './ColorSchemeContext';
import COLORS from '../constants/Colors';
import { rHeight, rWidth } from '../constants/PixelSize';
import { GRAPHIK_FONT } from '../constants/Constant';
import Clipboard from '@react-native-clipboard/clipboard';

// Lazy load FastImage and NoOrder components
const FastImage = React.lazy(() => import('react-native-fast-image'));
const NoOrder = React.lazy(() => import('../assets/NoOrders1.svg'));

const OrdersCard = React.memo(({ onOrderPress, orderRequests, ListHeaderComponent, ListFooterComponent }) => {
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL RETURNS
  const colorScheme = useColorScheme();
  const isDark = colorScheme == 'dark';
  const [showAllProducts, setShowAllProducts] = useState(0);
  
  // Memoize format functions to prevent recreation on every render
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }, []);
  
  const formatDateTime = useCallback((dateString, showOnlyTime = false) => {
    const date = new Date(dateString);
    let options = {};

    if (showOnlyTime) {
      options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
    } else {
      options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
    }
    let formattedDateTime = new Intl.DateTimeFormat('en-AU', options).format(
      date,
    );
    formattedDateTime = formattedDateTime.replace(/ at /, ' ');

    return formattedDateTime;
  }, []);

  const copyToClipboard = useCallback((item) => {
    const address = item.order?.address?.address;
    if (!address) {
      Alert.alert('Error', 'Address is not available for this item.');
      return;
    }
    Clipboard.setString(address);
    Alert.alert('Copied!', 'Address has been copied to clipboard.');
  }, []);

  const IMAGE_URL = `https://gobooze-tst-new.s3.ap-southeast-2.amazonaws.com/goboozestore/`;

  const renderItem = useCallback(({ item, index }) => {
    return (
      <Pressable
        key={index}
        onPress={() => onOrderPress(item)}
        style={[styles.lcardCon, isDark && styles.dcardCon]}>
        <View style={[styles.lheaderCon, isDark && styles.dheaderCon]}>
          <View>
            <Text style={[styles.ltext1, isDark && styles.dtext1]}>
              ORDER PLACED
            </Text>
            <Text style={[styles.lorder_date, isDark && styles.dorder_date]}>
              {formatDate(item.createdAt)}
            </Text>
          </View>

          <View style={{ marginLeft: rWidth(32) }}>
            <Text style={[styles.ltext1, isDark && styles.dtext1]}>
              ORDER ID
            </Text>
            <Text style={[styles.lorder_date, isDark && styles.dorder_date]}>
              {item.order.sequence_number}
            </Text>
          </View>
        </View>

        {item.order.order_Variants.slice(0, 1).map((product, productIndex) => (
          <View
            key={productIndex}
            style={[styles.lproductsCon, isDark && styles.dproductsCon]}>
            <View style={styles.lproductsRowCon}>
              <Text style={[styles.lqtyText, isDark && styles.dqtyText]}>
                {product.orderQuantity}x
              </Text>
              <FastImage
                source={{
                  uri: `${IMAGE_URL}${product.variantImage}`,
                }}
                resizeMode="contain"
                style={styles.product_Image}
              />
              <View style={{ marginLeft: rWidth(12) }}>
                <Text style={[styles.lbrandText, isDark && styles.dbrandText]}>
                  {product.quantity}-Pack,{' '}
                </Text>
                <Text style={[styles.lnameText, isDark && styles.dnameText]}>
                  {product.variantName}
                </Text>
                <Text style={[styles.lpriceText, isDark && styles.dpriceText]}>
                  ${(product.finalSellingPrice).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {showAllProducts === item._id && (
          <>
            {item.order.order_Variants.slice(1).map((product, index2) => (
              <View
                key={index2}
                style={[styles.lproductsCon, isDark && styles.dproductsCon]}>
                <View style={styles.lproductsRowCon}>
                  <Text style={[styles.lqtyText, isDark && styles.dqtyText]}>
                    {product.orderQuantity}x
                  </Text>
                  <FastImage
                    source={{
                      uri: `${IMAGE_URL}${product.variantImage}`,
                    }}
                    resizeMode="contain"
                    style={styles.product_Image}
                  />
                  <View style={{ marginLeft: rWidth(12) }}>
                    <Text
                      style={[styles.lbrandText, isDark && styles.dbrandText]}>
                      {product.quantity}-Pack,{' '}
                    </Text>
                    <Text
                      style={[styles.lnameText, isDark && styles.dnameText]}>
                      {product.variantName}
                    </Text>
                    <Text
                      style={[styles.lpriceText, isDark && styles.dpriceText]}>
                      ${(product.finalSellingPrice).toFixed(2)}
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
              setShowAllProducts(prevId =>
                prevId === item._id ? null : item._id,
              );
            }}
            style={{}}>
            <Text style={[styles.moreText]}>
              {showAllProducts === item._id
                ? 'see less'
                : `+${item.order.order_Variants.length - 1} items`}
            </Text>
          </TouchableOpacity>
        )}

        <View
          style={[
            styles.dummyView,
            isDark && { backgroundColor: COLORS.dark_disabled_background },
          ]}
        />
        <View style={[styles.rowCon]}>
          <Text style={[styles.lleftText, isDark && styles.dleftText]}>
            Customer Name:
          </Text>
          <Text style={[styles.lRightText, isDark && styles.dRightText]}>
            {item.order.address.first_name === item.order.address.first_name
              ? item.order.address.first_name
              : `${item.order.address.first_name} ${item.order.address.last_name}`}
          </Text>
        </View>
        <View style={[styles.rowCon, { margin: 10, overflow: 'hidden' }]}>
          <Text
            style={[
              styles.lleftText,
              isDark && styles.dleftText,
              { marginTop: rHeight(-16) },
            ]}>
            Address:
          </Text>
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => {
              const address = item?.order?.address?.address || 'NA';
              Clipboard.setString(address);
            }}
            activeOpacity={0.7}>
            <Text
              numberOfLines={2}
              style={[
                styles.lRightText,
                isDark && styles.dRightText,
                { width: '70%' },
              ]}>
              {item?.order?.address?.address || 'NA'}
            </Text>
            <Text style={[styles.lRightText1, isDark && styles.dRightText]}>
              Copy
            </Text>
          </TouchableOpacity>
        </View>
        {/* ORDER PLACED TIME */}
        <View style={[styles.rowCon, { overflow: 'hidden' }]}>
          <Text style={[styles.lleftText, isDark && styles.dleftText]}>
            Order Placed:
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.lRightText, isDark && styles.dRightText]}>
            {item?.order?.createdAt
              ? formatDateTime(item.order.createdAt)
              : 'NA'}
          </Text>
        </View>
        {/* {item?.order?.comments ? ( */}
        <View style={[styles.rowCon, { margin: 10, overflow: 'hidden' }]}>
          <Text style={[styles.lleftText, isDark && styles.dleftText]}>
            Instructions:
          </Text>
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            activeOpacity={0.7}>
            <Text
              numberOfLines={3}
              style={[
                styles.lRightText,
                isDark && styles.dRightText,
                { width: '90%', color: '#D3178A' },
              ]}>
              {item.order.comments || '-----'}
            </Text>
          </TouchableOpacity>
        </View>

        {['accepted', 'confirmed', 'ready-for-delivery', 'reached-pickup-location....'].includes(item?.delivery_status?.toLowerCase()) && (
          <View style={[styles.rowCon]}>
            <Text style={[styles.lleftText, isDark && styles.dleftText]}>
              Accepted By :
            </Text>
            <Text style={[styles.lRightText, isDark && styles.dRightText]}>
  {item?.deliveryUserDetails?.full_name
    ? item.deliveryUserDetails.full_name
    : item?.delivery_user
      ? item.delivery_user
      : 'Not Assigned Yet'}
</Text>

          </View>
        )}

        <View style={[styles.rowCon, { marginTop: rHeight(6) }]}>
          <Text style={[styles.lleftText, isDark && styles.dleftText]}>
            Delivery Status :
          </Text>
          <Text style={[styles.lRightText, isDark && styles.dRightText]}>
            {item?.delivery_status
              ? item.delivery_status
              : 'Not '}
          </Text>
        </View>




        {/* ) : null} */}
      </Pressable>
    );
  }, [isDark, formatDate, formatDateTime, copyToClipboard, showAllProducts, onOrderPress]);
  
  const keyExtractor = useCallback((item, index) => {
    return item?._id || item?.order?._id || `order-${index}`;
  }, []);
  
  const getItemLayout = useCallback((data, index) => {
    // Approximate item height for better performance
    return {
      length: 300, // Approximate height of each order card
      offset: 300 * index,
      index,
    };
  }, []);

  const ListEmptyComponent = useMemo(() => (
    <View style={styles.noOrderContainer}>
      <Suspense fallback={<View />}>
        <NoOrder />
      </Suspense>
      <Text style={[styles.noOrderText, isDark && styles.noOrderTextDark]}>
        No Orders
      </Text>
    </View>
  ), [isDark]);

  return (
    <>
      <FlatList
        data={orderRequests}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{paddingBottom: 30}}
      />
    </>
  );
});

export default OrdersCard;
const styles = StyleSheet.create({
  noOrderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: rHeight(50),
  },
  noOrderText: {
    fontSize: rWidth(16),
    color: COLORS.light_primary_text,
    fontFamily: GRAPHIK_FONT.MEDIUM,
    marginTop: rHeight(10),
  },
  noOrderTextDark: {
    color: COLORS.dark_primary_text,
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
  lRightText1: {
    color: '#D3178A',
    fontFamily: GRAPHIK_FONT.BOLD,
    fontSize: rWidth(14),
    marginLeft: rWidth(12),
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
});
