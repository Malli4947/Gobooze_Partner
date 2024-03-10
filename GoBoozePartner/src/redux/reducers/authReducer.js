import ActionConstants from '../ActionConstants';

const initialState = {
  isLoggedIn: false,
  bearerAccessToken: '',
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
    default:
      return state;
  }
};
