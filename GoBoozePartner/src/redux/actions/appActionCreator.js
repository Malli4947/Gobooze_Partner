import ActionConstants from '../ActionConstants';
import * as GoboozeAPI from '../GoboozeApi';

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
          //
          //
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
          console.log(
            '💕 ~ file: appActionCreator.js:49 ~ return ~ response:',
            response.data.data.userId,
          );
          const accessToken = response.data.data.token;
          const userId = response.data.data.userId;
          dispatch(saveAccessToken(accessToken));
          dispatch(saveLoginUserId(userId));
          dispatch(saveIsLoggedIn(true));
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
