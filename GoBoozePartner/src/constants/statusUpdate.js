import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MAIN_BASE_URL} from './Constant';

const updateOrder = async (orderId, orderStatus) => {
  try {
    const combinedData = await AsyncStorage.getItem('USER_DATA');
    const [accessToken, userId] = combinedData?.split(':') ?? [];
    const acceptRes = await axios.patch(
      `${MAIN_BASE_URL}order/api/orders/update-order-status/${orderId}`,
      {
        order_status: orderStatus,
      },
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      },
    );
    console.log(
      '💕 ~ file: NewOrderAlertScreen.js:49 ~ acceptOrder ~ acceptRes:',
      acceptRes,
    );
  } catch (e) {
    console.log('💕 ~ file: ReachPickupScreen.js:55 ~ updateOrder ~ e:', e);
  }
};

export default updateOrder;
