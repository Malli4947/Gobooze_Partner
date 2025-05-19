import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Alert,
  SafeAreaView,
  Linking,
  PermissionsIOS,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import COLORS from '../constants/Colors';
import {rHeight, rWidth} from '../constants/PixelSize';
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
import CustomButton from '../components/CustomButton';
import NewSlideButton from '../components/NewSlideButton';
import updateOrder from '../constants/statusUpdate';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import ImageResizer from 'react-native-image-resizer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {BackHandler} from 'react-native';
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

const ReachedDropScreen = ({route}) => {
  const OrderDetails = route.params.orderDetails;
  console.log(OrderDetails, 'OrderDetails');
  const navigation = useNavigation();

  const orders = OrderDetails.order.order_Variants;

  const storeDetails = route.params.orderDetails.order.store;
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
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCancelOrder, setShowCancelOrder] = useState(false);
  const [photo, setPhoto] = useState();
  console.log(
    '💕 ~ file: ReachedDropScreen.js:73 ~ ReachedDropScreen ~ photo:',
    photo,
  );

  const handleUpdateOrder = async () => {
    try {
      if (photo) {
        await updateOrder(OrderDetails.order_id, 'delivered');
      } else {
        Alert.alert('', 'Please upload the image');
      }
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
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup the event listener
  }, [navigation]);
  const onSuccessCancel = () => {
    navigation.navigate('Home');
  };
  const takePhoto1 = async () => {
    try {
      // Request camera permissions
      const cameraPermission = await PermissionsIOS.requestPermission('camera');

      if (cameraPermission !== 'authorized') {
        console.log('Camera permission denied');
        Alert.alert('Please provide camera permission to continue!');
        return;
      }

      // Define camera options
      let options = {
        mediaType: 'photo',
        saveToPhotos: true,
        quality: 0.8,
        includeBase64: false,
      };

      // Launch the camera
      launchCamera(options, response => {
        console.log('This is the response: ');
        console.log(response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          // Handle the photo response (e.g., set state, upload photo, etc.)
          console.log(
            '💕 ~ file: ReachedDropScreen.js:114 ~ takePhoto ~ response:',
            response,
          );

          const source = {
            uri: response.assets[0].uri,
            fileName: response.assets[0].fileName,
          };

          setPhoto(source);
          setShowPhotoModal(false);
          uploadPhoto(source);
        }
      });
    } catch (e) {
      Alert.alert('Something went wrong!');
      console.log('Error occurred: ', e);
    }
  };
  const takePhoto = () => {
    try {
      let options = {
        mediaType: 'photo',
        saveToPhotos: true,
        quality: 0.8,

        includeBase64: false,
      };

      launchCamera(options, response => {
        console.log('This is the response: ');
        console.log(response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        console.log(
          '💕 ~ file: ReachedDropScreen.js:114 ~ takePhoto ~ response:',
          response,
        );

        const source = {
          uri: response.assets[0].uri,
          fileName: response.assets[0].fileName,
        };

        setPhoto(source);
        setShowPhotoModal(false);
        uploadPhoto(source);
      });
    } catch (e) {
      console.log(e);
      Alert.alert('Something went wrong!');
    }
  };

  const uploadPhoto = async source => {
    const formData = new FormData();

    const resizedImage = await ImageResizer.createResizedImage(
      source.uri,
      800,
      600,
      'JPEG',
      80,
    );

    formData.append('Images', {
      uri: resizedImage.uri,
      name: 'image.jpg',
      type: 'image/jpg',
    });

    try {
      const response = await fetch(
        `https://devapigobooze.codefactstech.com/order/api/orders/upload-delivery-images/${OrderDetails.order_id}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log(
        '💕 ~ file: ReachedDropScreen.js:166 ~ uploadPhoto ~ response:',
        response,
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log('Upload Success', responseData);
      } else {
        const errorData = await response.json();
        console.log('Upload Error', errorData);
      }
    } catch (error) {
      console.log('Upload Error', error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkTheme && styles.dark_container]}>
      <PickOrderNowAlert modalVisible={false} />
      <AddPhotoAlert
        modalVisible={showPhotoModal}
        dismissModal={() => {
          setShowPhotoModal(false);
        }}
        cancelOrder={() => {
          setShowCancelOrder(true);
          setShowPhotoModal(false);
        }}
        openCamera={() => {
          takePhoto();
        }}
      />
      <CannotLeaveOrderAlert
        modalVisible={showCancelOrder}
        orderId={OrderDetails.order_id}
        onGoback={() => {
          setShowCancelOrder(false);
          setShowPhotoModal(true);
        }}
        onSuccessCancel={onSuccessCancel}
        dismissModal={() => {
          setShowCancelOrder(false);
          setShowPhotoModal(true);
        }}
      />
      <View style={{marginTop: insets.top, marginTop: 0}}>
        <NavBarWithBackButton
          backDisabled={true}
          onPress={() => {
            navigation.navigate('Home');
          }}
          title={'Reach Drop'}
        />
        <View style={[styles.seperator, darkSep]} />
      </View>

      {/* ---------------- BOTTOM CONTAINER ---------------- */}
      <ScrollView>
        {isPaidOnline && (
          <LeaveOrderAtDoorView
            Children={
              <CustomButton
                buttonText="Add Photo"
                showView={false}
                handleClick={() => {
                  console.log('h99------');
                  setShowPhotoModal(true);

                  if (photo) {
                    // Alert.alert('', 'Already Uploaded');
                    // return;
                  } else {
                    // setShowPhotoModal(true);
                  }
                }}
                buttonStyle={{
                  backgroundColor: isDarkTheme ? '#099A6A' : '#08875D',
                  height: 43,
                }}
              />
            }
          />
        )}
        {/* {!isPaidOnline && <UPIView orderDetails={OrderDetails} />} */}
        {photo && <Image source={photo} style={styles.deliveryImage} />}
        <CollectCashView
          isPaidOnline={isPaidOnline}
          isChecked={isChecked}
          orderDetails={OrderDetails}
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
                    storeDetails={OrderDetails.order.address.addressPhoneNumber}
                    id={1}
                    expandCustomerDetail={expandCustomerDetailView}
                    image={IMAGES.CUSTOMER}
                    title={`${OrderDetails.order.address.first_name}`}
                    customerDetail={{
                      name: `${OrderDetails.order.address.first_name}`,
                      mobileNum: `${OrderDetails.order.address.addressPhoneNumber}`,
                      // orderId: `#${OrderDetails.order_id.slice(
                      //   0,
                      //   5,
                      // )}-${OrderDetails.order_id.slice(-5)}`,
                      orderId: `${OrderDetails.order.sequence_number}`,
                      address: `${OrderDetails.order?.address?.address}`,
                    }}
                    onPress={() =>
                      setExpandCustomerDetailView(!expandCustomerDetailView)
                    }
                    Onpresses={() => {
                      Linking.openURL(
                        `tel:${OrderDetails.order.address.addressPhoneNumber}`,
                      );
                    }}
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
        {photo ? (
          <View
            style={[
              styles.slideBtnContainer,
              isDarkTheme && {backgroundColor: COLORS.dark_con},
            ]}>
            <NewSlideButton
              title={`Order Delivered`}
              navigationScreen={'Home'}
              onComplete={handleUpdateOrder}
              slideButoon={true}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
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
  deliveryImage: {
    height: rHeight(100),
    width: rHeight(100),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: rHeight(20),
  },
});

export default ReachedDropScreen;
