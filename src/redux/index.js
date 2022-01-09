import AsyncStorage from '@react-native-community/async-storage';

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import RootReducer from './RootReducer'


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'],
  blacklist: ['group'],
};

const persistedReducer = persistReducer(persistConfig, RootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

export {store, persistor};