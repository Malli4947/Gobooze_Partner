import axios from 'axios';
import {API_BASE_URL} from '../constants/Constant';

const headers = {
  accept: '*/*',
  'Content-Type': 'application/json',
};

// ---sendOtp---
export const sendOtp = mobileNum => {
  const param = {phone: `+91${mobileNum}`};
  return axios.post(`${API_BASE_URL}send-otp`, param, {headers});
};
// ---verifyOtp---
export const verifyOtp = params => {
  const param = params;
  return axios.post(`${API_BASE_URL}verify-otp`, param, {headers});
};
