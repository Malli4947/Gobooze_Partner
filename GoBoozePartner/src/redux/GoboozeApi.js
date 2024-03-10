import axios from 'axios';
import { API_BASE_URL } from '../constants/Constant';


export const sendOtp = params => {
    var param = JSON.stringify(params);
    return axios.post(API_BASE_URL + 'send-otp', param, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    });
  };
  