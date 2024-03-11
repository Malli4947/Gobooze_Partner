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
// ***************************************************************
// -------------------------- API CALLS -------------------------
// ***************************************************************
export const sendOtp = (mobileNumber, callback) => {
  return async (dispatch, getState) => {
    // const accessToken = getState().profile
    return GoboozeAPI.sendOtp(mobileNumber, accessToken)
      .then(response => {
        if (response.status == 200) {
          // dispatch(saveIsLoggedIn(true))
          // dispatch(saveAccessToken("true"))
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
