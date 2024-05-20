import {useSelector} from 'react-redux';
import ActionConstants from '../ActionConstants';
import * as GoboozeAPI from '../GoboozeApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ***************************************************************
// ----------------------- SAVE USER STATE -----------------------
// ***************************************************************
export const saveIsLoggedIn = val => ({
  type: ActionConstants.IS_LOGGED_IN,
  payload: val,
});

export const saveAccessToken = val => ({
  type: ActionConstants.BEARER_ACCESS_TOKEN,
  payload: val,
});

export const saveLoginUserId = val => ({
  type: ActionConstants.LOGIN_USER_ID,
  payload: val,
});
// ***************************************************************
// -------------------------- API CALLS -------------------------
// ***************************************************************
export const sendOtp = (mobileNumber, callback) => {
  return async (dispatch, getState) => {
    // const accessToken = getState().profile
    return GoboozeAPI.sendOtp(mobileNumber)
      .then(response => {
        if (response.status == 200) {
          callback && callback({status: 200, data: response.data});
        }
      })
      .catch(error => {
        console.log('error login api---', error && error.response);
        callback &&
          callback({error: error && error.response && error.response.data});
      });
  };
};

// --verifyOtp--
export const verifyOtp = (params, callback) => {
  return async (dispatch, getState) => {
    return GoboozeAPI.verifyOtp(params)
      .then(response => {
        if (response.status == 200) {
          const accessToken = response.data.data.token;
          console.log(
            '💕 ~ file: appActionCreator.js:49 ~ return ~ accessToken:',
            accessToken,
          );
          const userId = response.data.data.userId;
          console.log(
            '💕 ~ file: appActionCreator.js:50 ~ return ~ userId:',
            userId,
          );
          const combinedData = `${accessToken}:${userId}`;

          console.log(
            '💕 ~ file: appActionCreator.js:61 ~ return ~ combinedData:',
            combinedData,
          );
          AsyncStorage.setItem('USER_DATA', combinedData);

          dispatch(saveAccessToken(accessToken));
          dispatch(saveLoginUserId(userId));
          dispatch(saveIsLoggedIn(true));
          callback && callback({status: 200, data: response.data});
        }
      })
      .catch(error => {
        callback({error: error && error.response && error.response.data});
      });
  };
};

export const fecthDeliveryOrders = callback => {
  return async (dispatch, getState) => {
    const accessToken = getState().auth.bearerAccessToken;
    console.log(
      '💕 ~ file: appActionCreator.js:66 ~ return ~ accessToken:',
      accessToken,
    );

    return GoboozeAPI.deliveryOrders(accessToken)
      .then(response => {
        if (response.status == 200) {
          callback && callback({status: 200, data: response.data});
        }
      })
      .catch(error => {
        console.log(
          '💕 ~ file: appActionCreator.js:64 ~ return ~ error:',
          error,
        );

        callback({error: error && error.response && error.response.data});
      });
  };
};
