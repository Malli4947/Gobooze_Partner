import ActionConstants from '../ActionConstants';

const initialState = {};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionConstants.IS_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    default:
      return state;
  }
};
