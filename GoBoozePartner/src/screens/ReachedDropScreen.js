import {View, StyleSheet, ScrollView, FlatList} from 'react-native';
import React, {useState} from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import COLORS from '../constants/Colors';
import {rHeight} from '../constants/PixelSize';
import {IMAGES} from '../constants/Constant';
import NavBarWithBackButton from '../components/NavBarWithBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomSlideButton from '../components/SlideButton/CustomSlideButton';
import OrderDetailsView from '../components/OrderDetailsView';
import PickOrderNowAlert from './PickOrderNowAlert';
import CollectCashView from '../components/CollectCashView';
import LeaveOrderAtDoorView from '../components/LeaveOrderAtDoorView';
import UPIView from '../components/UPIView';
import AddPhotoAlert from '../components/AddPhotoAlert';
import CannotLeaveOrderAlert from '../components/CannotLeaveOrderAlert';

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

const orderDetails = {
  amount: 76.89,
  orderId: 4286690449,
};

const ReachedDropScreen = props => {
  const [isOrderReady, setIsOrderReady] = useState(false);
  const [isPaidOnline, setIsPaidOnline] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [expandOrderDetailView, setExpandOrderDetailView] = useState(false);
  const [expandCustomerDetailView, setExpandCustomerDetailView] =
    useState(false);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const slideBtnColor = isDarkTheme ? '#FFFFFF99' : '#1D2433A6';
  const darkSep = isDarkTheme && {
    backgroundColor: COLORS.dark_theme_background,
  };

  return (
    <View style={[styles.container, isDarkTheme && styles.dark_container]}>
      <PickOrderNowAlert modalVisible={false} />
      <AddPhotoAlert modalVisible={false} />
      <CannotLeaveOrderAlert modalVisible={true} />
      <View style={{marginTop: insets.top}}>
        <NavBarWithBackButton title={'Reach Drop'} />
        <View style={[styles.seperator, darkSep]} />
      </View>

      {/* ---------------- BOTTOM CONTAINER ---------------- */}
      <ScrollView>
        {isPaidOnline && <LeaveOrderAtDoorView />}
        {!isPaidOnline && <UPIView orderDetails={orderDetails} />}

        <CollectCashView
          isPaidOnline={isPaidOnline}
          isChecked={isChecked}
          orderDetails={orderDetails}
          onCheckboxPress={() => setIsChecked(!isChecked)}
        />
        <View style={{paddingBottom: 20}}>
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={{paddingBottom: 5}}
            data={[{}, {}]}
            renderItem={({item, index}) => {
              if (index === 0) {
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
          title="Order Delivered"
          confirmedText="Order Delivered"
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
  slideBtnContainer: {
    width: '100%',
    backgroundColor: '#FFF',
  },
});

export default ReachedDropScreen;
