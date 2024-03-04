import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
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
import {CONST_STYLES} from '../constants/ConstStyles';
import {BlurView} from '@react-native-community/blur';

// const detailsData = [{id: 0, title: 'Order Details'}]
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

const CollectMoneyScreen = props => {
  const [isOrderReady, setIsOrderReady] = useState(false);
  const [showQR, setShowQR] = useState(true);
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
        <NavBarWithBackButton title={'Reach Drop'} />
        <View style={[styles.seperator, darkSep]} />
      </View>

      {/* ---------------- BOTTOM CONTAINER ---------------- */}
      <ScrollView>
        <View style={[styles.upiContainer, CONST_STYLES.shadow]}>
          <View style={styles.topCon}>
            <Image
              style={styles.headerUpiImg}
              source={
                isDarkTheme ? IMAGES.UPI_FRAME_DARK : IMAGES.UPI_FRAME_LIGHT
              }
            />
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  styles.collectCashText
                }>{`Collect $${89.59} via UPI`}</Text>
              <Text style={styles.cashDescText}>
                Payment goes directly to GoBooze
              </Text>
            </View>
          </View>
          <View style={styles.bottomUpiCon}>
            <View style={{alignItems: 'center', margin: 10}}>
              <Image style={styles.upiImg} source={IMAGES.DUMMY_UPI} />
              <View style={styles.disclaimerCon}>
                <Image
                  resizeMode="contain"
                  style={{width: 20}}
                  source={IMAGES.DISCLAIMER}
                />
                <Text style={styles.upiDisclaimer}>
                  100% secure payment to GoBooze
                </Text>
              </View>
            </View>
            {showQR && (
              <BlurView
                style={styles.blurView}
                blurType={'light'}
                blurAmount={3}>
                <TouchableOpacity
                  style={styles.seeQrImgCon}
                  onPress={() => setShowQR(!showQR)}>
                  <Image
                    resizeMode="contain"
                    style={styles.seeQrImg}
                    source={
                      isDarkTheme ? IMAGES.SEE_QR_DARK : IMAGES.SEE_QR_LIGHT
                    }
                  />
                </TouchableOpacity>
              </BlurView>
            )}
          </View>
        </View>

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
                    id={3}
                    expandCustomerDetail={expandCustomerDetailView}
                    image={IMAGES.CUSTOMER}
                    title={'Rahul Singh'}
                    customerDetail={{
                      name: 'Rahul Singh',
                      mobileNum: '8866157629',
                      orderId: '4286690449',
                    }}
                    onPress={() =>
                      setExpandCustomerDetailView(!expandCustomerDetailView)
                    }
                  />
                );
              } else {
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
  upiContainer: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.ligth_grey,
    marginHorizontal: rWidth(20),
    marginTop: rHeight(15),
    backgroundColor: '#FFF',
  },
  topCon: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: rWidth(15),
    marginTop: rHeight(15),
  },
  headerUpiImg: {
    width: rWidth(50),
    height: rHeight(50),
  },
  collectCashText: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rHeight(16),
    color: COLORS.light_primary_text,
  },
  cashDescText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(13),
    color: '#1D2433CC',
    paddingTop: 5,
  },
  bottomUpiCon: {
    marginVertical: rHeight(15),
    marginHorizontal: rWidth(15),
  },
  upiImg: {
    width: rWidth(150),
    height: rHeight(150),
  },
  upiDisclaimer: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(12),
  },
  disclaimerCon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  seeQrImgCon: {
    position: 'absolute',
    bottom: 55,
    width: '60%',
    height: '30%',
  },
  seeQrImg: {
    width: '100%',
    height: '100%',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  slideBtnContainer: {
    width: '100%',
    backgroundColor: '#FFF',
  },
});

export default CollectMoneyScreen;
