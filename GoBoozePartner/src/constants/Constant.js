import {Platform} from 'react-native';

export const API_BASE_URL =
  'https://devapigobooze.codefactstech.com/admin/api/partner/';

export const MAIN_BASE_URL = 'https://devapigobooze.codefactstech.com/';

export const apiConfig = {
  sendOtp: 'send-otp',
  verifyOtp: 'verify-otp',
  deliveryOrders: 'order/api/orders/get-orders-by-delivery',
};

export const GRAPHIK_FONT = {
  BOLD: Platform.OS === 'android' ? 'GraphikBold' : 'Graphik-Bold',
  BOLD_ITALIC:
    Platform.OS === 'android' ? 'GraphikBoldItalic' : 'Graphik-BoldItalic',
  REGULAR: Platform.OS === 'android' ? 'GraphikRegular' : 'Graphik-Regular',
  MEDIUM: Platform.OS === 'android' ? 'GraphikMedium' : 'Graphik-Medium',
  SEMIBOLD: Platform.OS === 'android' ? 'GraphikSemibold' : 'Graphik-Semibold',
  SEMIBOLD_ITALIC:
    Platform.OS === 'android'
      ? 'GraphikSemiboldItalic'
      : 'Graphik-SemiboldItalic',
  LIGHT: Platform.OS === 'android' ? 'GraphikLight' : 'Graphik-Light',
  ITALIC:
    Platform.OS === 'android'
      ? 'GraphikRegularItalic'
      : 'Graphik-RegularItalic',
};

export const IMAGES = {
  GO_BOOZE: require('../assets/other_pngs/gobooze.png'),
  GO_BOOZE_DARK: require('../assets/other_pngs/gobooze_dark.png'),
  INTRO_LIGHT: require('../assets/other_pngs/intro.png'),
  INTRO_DARK: require('../assets/other_pngs/intro_dark.png'),
  DELETE: require('../assets/other_pngs/delete.png'),
  CAMERA: require('../assets/other_pngs/camera.png'),
  GALLERY: require('../assets/other_pngs/gallery.png'),
  CANCEL: require('../assets/other_pngs/cancel.png'),
  USER: require('../assets/other_pngs/user.png'),
  EXPORT: require('../assets/other_pngs/export.png'),
  CHECK: require('../assets/other_pngs/check.png'),
  MENU: require('../assets/other_pngs/menu.png'),
  CUBE: require('../assets/other_pngs/cube.png'),
  FORWARD: require('../assets/other_pngs/forward.png'),
  CLOCK: require('../assets/other_pngs/clock.png'),
  GO_LOGO: require('../assets/other_pngs/gologo.png'),
  ARROW_RIGHT: require('../assets/other_pngs/arrow_right.png'),
  BACK: require('../assets/other_pngs/back.png'),
  CALL: require('../assets/other_pngs/call.png'),
  LOC_IMG: require('../assets/other_pngs/loc_img.png'),
  BOX: require('../assets/other_pngs/box.png'),
  CUSTOMER: require('../assets/other_pngs/customer.png'),
  COLLAPSE: require('../assets/other_pngs/collapse.png'),
  EXPAND: require('../assets/other_pngs/arrow-up.png'),
  SHOP: require('../assets/other_pngs/shop.png'),
  TIMER: require('../assets/other_pngs/timer.png'),
  PICK_ORDER_LIGHT: require('../assets/other_pngs/pick_order_light.png'),
  PICK_ORDER_DARK: require('../assets/other_pngs/pick_order_dark.png'),
  DUMMY_WHISKEY: require('../assets/other_pngs/dummy_whiskey.png'),
  UPI_FRAME_DARK: require('../assets/other_pngs/upi_frame_dark.png'),
  UPI_FRAME_LIGHT: require('../assets/other_pngs/upi_frame_light.png'),
  SEE_QR_DARK: require('../assets/other_pngs/see_qr_dark.png'),
  SEE_QR_LIGHT: require('../assets/other_pngs/see_qr_light.png'),
  DUMMY_UPI: require('../assets/other_pngs/upi_dummy.png'),
  DUMMY_UPI_DARK: require('../assets/other_pngs/upi_dark.png'),
  DISCLAIMER: require('../assets/other_pngs/disclaimer.png'),
  LOCATION: require('../assets/other_pngs/location.png'),
  CHECKED_DARK: require('../assets/other_pngs/checked_dark.png'),
  CHECKED_LIGHT: require('../assets/other_pngs/checked_light.png'),
  UNCHECKED_LIGHT: require('../assets/other_pngs/unchecked_light.png'),
  UNCHECKED_DARK: require('../assets/other_pngs/unchecked_dark.png'),
  COLLECTCASH_DARK: require('../assets/other_pngs/collect_cash_dark.png'),
  COLLECTCASH_LIGHT: require('../assets/other_pngs/collect_cash_light.png'),
  PAID_LIGHT: require('../assets/other_pngs/paid_light.png'),
  PAID_DARK: require('../assets/other_pngs/paid_dark.png'),
  BIN_DARK: require('../assets/other_pngs/bin_dark.png'),
  BIN_LIGHT: require('../assets/other_pngs/bin_light.png'),
  CAMERA_OUTLINED: require('../assets/other_pngs/camera_outlined.png'),
  RIGHT_PHOTO_LIGHT: require('../assets/other_pngs/right_photo.png'),
  WRONG_PHOTO_LIGHT: require('../assets/other_pngs/wrong_photo.png'),
  RIGHT_PHOTO_DARK: require('../assets/other_pngs/right_photo_dark.png'),
  WRONG_PHOTO_DARK: require('../assets/other_pngs/wrong_photo_dark.png'),
};
