import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {useColorScheme} from './ColorSchemeContext';
import COLORS from '../constants/Colors';
import {rHeight, rWidth} from '../constants/PixelSize';
import {GRAPHIK_FONT} from '../constants/Constant';
import FastImage from 'react-native-fast-image';

const listOfOrders = [
  {
    id: '428669-0449',
    products: [
      {
        id: 1,
        qty: 1,

        barndName: 'vickers gin',
        productName: 'Vickers London Dry Gin 37.0%',
        price: '$41.90',
        image:
          'https://w7.pngwing.com/pngs/203/575/png-transparent-lager-beer-heineken-wine-gosser-beer-bottle-heineken-beer-bottle-plastic-bottle-material-beer-thumbnail.png',
      },
      {
        qty: 3,

        barndName: 'vickers gin',
        productName: 'Vickers London Dry Gin 37.0%',
        price: '$41.90',
        image:
          'https://w7.pngwing.com/pngs/203/575/png-transparent-lager-beer-heineken-wine-gosser-beer-bottle-heineken-beer-bottle-plastic-bottle-material-beer-thumbnail.png',
      },
      {
        qty: 4,

        barndName: 'vickers gin',
        productName: 'Vickers London Dry Gin 37.0%',
        price: '$41.90',
        image:
          'https://w7.pngwing.com/pngs/203/575/png-transparent-lager-beer-heineken-wine-gosser-beer-bottle-heineken-beer-bottle-plastic-bottle-material-beer-thumbnail.png',
      },
    ],
    orderDate: '18 January 2024',
  },

  {
    id: '428669-0446',
    orderDate: '18 January 2024',
    products: [
      {
        id: 1,
        qty: 1,

        barndName: 'vickers gin',
        productName: 'Vickers London Dry Gin 37.0%',
        price: '$41.90',
        image:
          'https://w7.pngwing.com/pngs/203/575/png-transparent-lager-beer-heineken-wine-gosser-beer-bottle-heineken-beer-bottle-plastic-bottle-material-beer-thumbnail.png',
      },

      {
        qty: 4,

        barndName: 'vickers gin',
        productName: 'Vickers London Dry Gin 37.0%',
        price: '$41.90',
        image:
          'https://w7.pngwing.com/pngs/203/575/png-transparent-lager-beer-heineken-wine-gosser-beer-bottle-heineken-beer-bottle-plastic-bottle-material-beer-thumbnail.png',
      },
    ],
  },
];

const OrdersCard = ({onOrderPress, orderRequests}) => {
  console.log(
    '💕 ~ file: OrdersCard.js:80 ~ OrdersCard ~ orderRequests:',
    orderRequests,
  );
  const colorScheme = useColorScheme();
  const isDark = colorScheme == 'dark';
  const [showAllProducts, setShowAllProducts] = useState(0);

  const formatDate = dateString => {
    const date = new Date(dateString);
    const options = {day: '2-digit', month: 'long', year: 'numeric'};
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
   const IMAGE_URL=`https://gobooze-bucket.s3.eu-north-1.amazonaws.com/goboozestore/`
   return (
    <>
      {orderRequests?.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => onOrderPress(item)}
          style={[styles.lcardCon, isDark && styles.dcardCon]}>
          {/* ---headerCon */}
          <View style={[styles.lheaderCon, isDark && styles.dheaderCon]}>
            <View>
              <Text style={[styles.ltext1, isDark && styles.dtext1]}>
                ORDER PLACED
              </Text>
              <Text style={[styles.lorder_date, isDark && styles.dorder_date]}>
                {formatDate(item.createdAt)}
              </Text>
            </View>

            <View style={{marginLeft: rWidth(32)}}>
              <Text style={[styles.ltext1, isDark && styles.dtext1]}>
                ORDER ID
              </Text>
              <Text style={[styles.lorder_date, isDark && styles.dorder_date]}>
                {item.order.sequence_number}
              </Text>
            </View>
          </View>

          {/* --ProductsListing-- */}
          <>
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
                  <View style={{marginLeft: rWidth(12)}}>
                    <Text
                      style={[
                        styles.lbrandText,
                        isDark && styles.dbrandText,
                      ]}>
                      {product.quantity}-Pack,{' '}
                    </Text>
                    <Text
                      style={[
                        styles.lnameText,
                        isDark && styles.dnameText,
                      ]}>
                      {product.variantName}
                    </Text>
                    <Text
                      style={[
                        styles.lpriceText,
                        isDark && styles.dpriceText,
                      ]}>
                      ${product.finalSellingPrice}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </>
          {/* hide and show more Products=== */}
          {showAllProducts === item._id && (
            <>
              {item.order.order_Variants.slice(1).map((product, index2) => (
                <View
                  key={index2}
                  style={[
                    styles.lproductsCon,
                    isDark && styles.dproductsCon,
                  ]}>
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
                    <View style={{marginLeft: rWidth(12)}}>
                      <Text
                        style={[
                          styles.lbrandText,
                          isDark && styles.dbrandText,
                        ]}>
                        {product.quantity}-Pack,{' '}
                      </Text>
                      <Text
                        style={[
                          styles.lnameText,
                          isDark && styles.dnameText,
                        ]}>
                        {product.variantName}
                      </Text>
                      <Text
                        style={[
                          styles.lpriceText,
                          isDark && styles.dpriceText,
                        ]}>
                        ${product.finalSellingPrice}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* ---More Items Text--- */}
          {item.order.order_Variants.length > 1 && (
            <TouchableOpacity
              onPress={() => {
                setShowAllProducts(prevId => (prevId === item._id ? null : item._id));
              }}
              style={{}}>
              <Text style={[styles.moreText]}>
                {showAllProducts === item._id
                  ? 'see less'
                  : `+${item.order.order_Variants.length - 1} items`}
              </Text>
            </TouchableOpacity>
          )}
          {/* --dummmy View---- */}
          <View
            style={[
              styles.dummyView,
              isDark && {backgroundColor: COLORS.dark_disabled_background},
            ]}
          />
          {/* ---Customer Name */}
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
          {/* ---Order Status */}
          <View style={[styles.rowCon, {marginTop: rHeight(8)}]}>
            <Text style={[styles.lleftText, isDark && styles.dleftText]}>
              Order Status:
            </Text>
            <View style={[styles.statusCon]}>
              <Text
                style={[
                  styles.lRightText,
                  isDark && styles.dRightText,
                  {color: '#0162DD', marginLeft: 0},
                ]}>
                {item.order.order_status}
              </Text>
            </View>
          </View>
        </Pressable>
      ))}
    </>
  );
};



export default OrdersCard;
const styles = StyleSheet.create({
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
});
