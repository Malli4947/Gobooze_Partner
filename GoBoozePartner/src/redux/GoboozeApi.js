import axios from 'axios';
import {API_BASE_URL, MAIN_BASE_URL, apiConfig} from '../constants/Constant';
import {useSelector} from 'react-redux';

const headers = {
  accept: '*/*',
  'Content-Type': 'application/json',
};

// ---sendOtp---
export const sendOtp = mobileNum => {
  const param = {phone: `+61${mobileNum}`};
  // console.log('💕 ~ file: GoboozeApi.js:14 ~ sendOtp ~ param:', param);

  return axios.post(`${API_BASE_URL}${apiConfig.sendOtp}`, param, {headers});
};
// ---verifyOtp---
export const verifyOtp = params => {
  const param = params;
  // console.log('💕 ~ file: GoboozeApi.js:20 ~ verifyOtp ~ param:', param);
  return axios.post(`${API_BASE_URL}${apiConfig.verifyOtp}`, param, {headers});
};

//---deliveryOrders---
export const deliveryOrders = params => {
  // console.log('💕 ~ file: GoboozeApi.js:22 ~ deliveryOrders ~ params:', params);
  return axios.get(`${MAIN_BASE_URL}${apiConfig.deliveryOrders}`, {
    headers: {
      ...headers,
      Authorization: params ? `${params}` : '',
    },
  });
};
// --- fecth pending Orders---

export const pendingOrders = params => {
  // console.log('💕 ~ file: GoboozeApi.js:22 ~ deliveryOrders ~ params:', params);
  return axios.post(
    `${MAIN_BASE_URL}${apiConfig.deliveryOrders(params)}`,
    {
      order_status: 'pending',
    },
    {
      headers: {
        ...headers,
        Authorization: params ? `${params}` : '',
      },
    },
  );
};
