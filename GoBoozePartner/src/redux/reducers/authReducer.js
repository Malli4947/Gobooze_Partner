import ActionConstants from '../ActionConstants';

const initialState = {
  isLoggedIn: false,
  bearerAccessToken: '',
  loginUserId: '',
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionConstants.IS_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    case ActionConstants.BEARER_ACCESS_TOKEN:
      return {
        ...state,
        bearerAccessToken: action.payload,
      };
    case ActionConstants.LOGIN_USER_ID:
      return {
        ...state,
        loginUserId: action.payload,
      };
    default:
      return state;
  }
};
