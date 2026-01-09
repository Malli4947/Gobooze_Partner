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
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useColorScheme} from '../components/ColorSchemeContext';
import OTPTextView from '../components/OTPTextView';
import COLORS from '../constants/Colors';
import {rHeight, rWidth} from '../constants/PixelSize';
import {GRAPHIK_FONT, IMAGES} from '../constants/Constant';
import NavBarWithBackButton from '../components/NavBarWithBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import OrderDetailsView from '../components/OrderDetailsView';
import PickOrderNowAlert from './PickOrderNowAlert';
import CollectCashView from '../components/CollectCashView';
import LeaveOrderAtDoorView from '../components/LeaveOrderAtDoorView';
import AddPhotoAlert from '../components/AddPhotoAlert';
import CannotLeaveOrderAlert from '../components/CannotLeaveOrderAlert';
import CustomButton from '../components/CustomButton';
import updateOrder from '../constants/statusUpdate';
import {launchCamera} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {useNavigation} from '@react-navigation/native';
import {BackHandler} from 'react-native';
import BackA from '../assets/BackA.svg';
import RightA from '../assets/RightA.svg';
import ModalCancelButton from '../components/ModalCancelButton';


const ReachedDropScreen = ({route}) => {
  const orderData = route?.params?.orderData;
  const navigation = useNavigation();
  const orders = orderData?.order?.order_Variants;
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [inputOtp, setInputOtp] = useState('');
  const [isOtpValid, setIsOtpValid] = useState(false);
  const storeDetails = route?.params?.orderData?.order?.store;
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
  
  const handleUpdateOrder = async () => {
  const orderId = orderData?.order?._id;
  if (!orderId) {
    Alert.alert('Error', 'Order ID is missing!');
    return;
  }
  try {
    const result = await updateOrder(orderId, 'delivered'); 
    if (result.success) { 
      Alert.alert('Success', result.message);
      navigation.navigate('Home');
    } else {
      Alert.alert('Error', result.message);
    }
  } catch (e) {
    Alert.alert('Error', 'Something went wrong while updating the order');
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

    return () => backHandler.remove(); 
  }, [navigation]);
  const onSuccessCancel = () => {
    navigation.navigate('Home');
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
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error:', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button:', response.customButton);
        } else if (response.assets && response.assets.length > 0) {
          const source = {
            uri: response.assets[0].uri,
            fileName: response.assets[0].fileName,
          };
          setPhoto(source);
          setShowPhotoModal(false);
          uploadPhoto(source);
        } else {
          console.log('No assets found in the response');
        }
      });
    } catch (e) {
      console.log('Exception:', e);
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
        `https://gobooze-test.codefactstech.com/order/api/orders/upload-delivery-images/${orderData.order_id}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.ok) {
        const responseData = await response.json();
        console.log('Upload Success', responseData);
      } else {
        const errorData = await response.json();
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
        orderId={orderData?.order_id}
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
          title={'Reached Delivery Location'}
        />
        <View style={[styles.seperator, darkSep]} />
      </View>
      <ScrollView>
        {isPaidOnline && (
          <LeaveOrderAtDoorView
            Children={
              <CustomButton
                buttonText="Add Photo"
                showView={false}
                handleClick={() => {
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
        {photo && <Image source={photo} style={styles.deliveryImage} />}
        <CollectCashView
          isPaidOnline={isPaidOnline}
          isChecked={isChecked}
          orderDetails={orderData}
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
                    storeDetails={orderData?.order?.address?.addressPhoneNumber}
                    id={1}
                    expandCustomerDetail={expandCustomerDetailView}
                    image={IMAGES.CUSTOMER}
                    title={`${orderData?.order?.address?.first_name}`}
                    customerDetail={{
                      name: `${orderData?.order?.address?.first_name}`,
                      mobileNum: `${orderData?.order?.address?.addressPhoneNumber}`,
                      orderId: `${orderData?.order?.sequence_number}`,
                      address: `${orderData?.order?.address?.address}`,
                      instructions: `${orderData?.order?.comments}`,
                    }}
                    onPress={() =>
                      setExpandCustomerDetailView(!expandCustomerDetailView)
                    }
                    Onpresses={() => {
                      Linking.openURL(
                        `tel:${orderData?.order?.address?.addressPhoneNumber}`,
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
      <View
        style={[
          styles.slideBtnContainer,
          isDarkTheme && {backgroundColor: COLORS.dark_con},
        ]}>
        <View style={styles.flexBtn}>
          <TouchableOpacity
            style={styles.btnNo}
            onPress={() => navigation.goBack()}>
            <BackA />
            <Text style={[styles.no, isDarkTheme && {color: '#fff'}]}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnNo1}
            onPress={() =>   handleUpdateOrder()}>
            <Text style={styles.yes}>Deliver Order</Text>
            <RightA />
          </TouchableOpacity>
        </View>
       <Modal
  visible={showOtpModal}
  transparent
  animationType="slide"
  onRequestClose={() => setShowOtpModal(false)}>
  <View style={styles.mainOuterComponent}>
    <View style={styles.mainContainer}>
      <ModalCancelButton onPress={() => setShowOtpModal(false)} />
      <View
        style={[
          styles.bottomContainer,
          isDarkTheme && {backgroundColor: COLORS.dark_theme_background},
        ]}>
        <Text style={[styles.item, isDarkTheme && {color: '#fff'}]}>
          Enter OTP
        </Text>

        <View style={styles.otp}>
          <OTPTextView
            handleTextChange={value => {
              setInputOtp(value);
              if (value.length === 4 && value === '1234') {
                setIsOtpValid(true);
              } else {
                setIsOtpValid(false);
              }
            }}
            containerStyle={{marginTop: 20}}
            inputCount={4}
            textInputStyle={{
              backgroundColor: isDarkTheme ? '#00000095' : '#f5f5f5',
              color: isDarkTheme ? '#fff' : '#000',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDarkTheme ? '#555' : '#ccc',
              paddingVertical: rHeight(10),
              fontSize: rWidth(16),
            }}
            tintColor={COLORS.primary_pink}
            offTintColor={COLORS.ligth_grey}
          />
        </View>
<View style={{paddingHorizontal:rWidth(16)}}>
<TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: isOtpValid
                ? COLORS.primary_pink
                : COLORS.ligth_grey,
            },
          ]}
          disabled={!isOtpValid}
          onPress={() => {
            setShowOtpModal(false);
            handleUpdateOrder();
          }}>
          <Text style={styles.btnTxt}>Continue</Text>
        </TouchableOpacity>
</View>
        
      </View>
    </View>
  </View>
</Modal>

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
  no: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(12),
    color: '#000',
    alignSelf: 'center',
  },
  yes: {
    fontFamily: GRAPHIK_FONT.MEDIUM,
    fontSize: rWidth(12),
    color: '#FFF',
    alignSelf: 'center',
  },
  btnNo: {
    borderWidth: 1,
    borderColor: '#D3178A',
    paddingVertical: rHeight(8),
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rWidth(30),
    marginRight: rWidth(8),
  },
  btnNo1: {
    paddingVertical: rHeight(8),
    borderRadius: 16,
    backgroundColor: '#D3178A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rWidth(30),
    borderWidth: 1,
    borderColor: '#D3178A',
    marginLeft: rWidth(8),
  },
  flexBtn: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingTop: rHeight(16),
    paddingBottom: rHeight(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
 modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'flex-end', 
},

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'flex-end',
},

 otp: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: rHeight(80),
  },

 mainOuterComponent: {
    flex: 1,
    backgroundColor: '#00000095',
  },
  mainContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSeperator: {
    position: 'absolute',
    marginTop: 20,
    width: 50,
    height: 4,
    backgroundColor: '#D1D5DB',
    marginBottom: 30,
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  title: {
    fontFamily: GRAPHIK_FONT.SEMIBOLD,
    fontSize: rHeight(22),
    color: COLORS.light_primary_text,
    paddingVertical: rHeight(8),
    textAlign:'center'
  },
  desc: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(13),
  },
  photoCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: '5%',
    marginTop: rHeight(20),
    marginBottom: rHeight(5),
  },
  photo: {
    width: rWidth(168),
    height: rHeight(232),
  },
  clockImg: {
    width: rWidth(22),
    height: rHeight(22),
    marginRight: 5,
  },
  bottomText: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    fontSize: rHeight(15),
    marginTop: rWidth(15),
    paddingBottom: rHeight(45),
    alignSelf: 'center',
    color: COLORS.red_error,
  },
   btnTxt: {
    fontFamily: GRAPHIK_FONT.REGULAR,
    color: '#FFF',
    fontSize: rWidth(16),
  },
  btn: {
    backgroundColor: '#D3178A',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: rHeight(12),
    borderRadius: 99,
    paddingHorizontal:rWidth(16)
  },
   item: {
    color: '#070707',
    fontSize: rWidth(22),
    fontFamily: GRAPHIK_FONT.REGULAR,
    textAlign: 'center',
  },


});

export default ReachedDropScreen;
