import axios from 'axios';
import {API_BASE_URL, MAIN_BASE_URL, apiConfig} from '../constants/Constant';
import {useSelector} from 'react-redux';

const headers = {
  accept: '*/*',
  'Content-Type': 'application/json',
};

// ---sendOtp---
export const sendOtp = mobileNum => {
  const param = {phone: `+91${mobileNum}`};
  return axios.post(`${API_BASE_URL}${apiConfig.sendOtp}`, param, {headers});
};
// ---verifyOtp---
export const verifyOtp = params => {
  const param = params;
  return axios.post(`${API_BASE_URL}${apiConfig.verifyOtp}`, param, {headers});
};

//---deliveryOrders---
export const deliveryOrders = params => {
  console.log('💕 ~ file: GoboozeApi.js:22 ~ deliveryOrders ~ params:', params);
  return axios.get(`${MAIN_BASE_URL}${apiConfig.deliveryOrders}`, {
    headers: {
      ...headers,
      Authorization: params ? `${params}` : '',
    },
  });
};
