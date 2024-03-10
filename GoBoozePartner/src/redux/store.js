import AsyncStorage from '@react-native-async-storage/async-storage';
import {legacy_createStore as createStore, combineReducers, applyMiddleware} from 'redux';
import persistReducer from 'redux-persist/es/persistReducer';
import {thunk} from 'redux-thunk';
import {authReducer} from './reducers/authReducer';
import {orderReducer} from './reducers/orderReducer';

const reducers = combineReducers({
  auth: authReducer,
  order: orderReducer,
});

const presistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(presistConfig, reducers);

const configureStore = () => {
  return createStore(persistedReducer, applyMiddleware(thunk));
};
export default configureStore;
