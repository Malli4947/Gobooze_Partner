import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAIN_BASE_URL } from './Constant';

const updateOrder = async (orderId, orderStatus) => {
  try {
const combinedData = await AsyncStorage.getItem('USER_DATA');
    const [accessToken, userId] = combinedData?.split(':') ?? [];
    const response = await axios.patch(
      `${MAIN_BASE_URL}order/api/orders/update-order-status/${orderId}`,
      { order_status: orderStatus },
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      },
    );
    return {
      success: true,
      message: response.data?.message || 'Order updated successfully',
      data: response.data,
    };
  } catch (error) {
    console.log('updateOrder error:', error.response?.data || error.message);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to update order',
    };
  }
};

export default updateOrder;
