import ActionConstants from '../ActionConstants';
import * as GoboozeAPI from '../GoboozeApi';

// ***************************************************************
// ----------------------- SAVE USER STATE -----------------------
// ***************************************************************
export const saveIsLoggedIn = val => ({
  type: ActionConstants.IS_LOGGED_IN,
  payload: val,
});


// ***************************************************************
// -------------------------- API CALLS -------------------------
// ***************************************************************
export const loginUser = (mobileNumber, callback) => {
  return async (dispatch, getState) => {
    return GoboozeAPI.loginUser(mobileNumber)
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
