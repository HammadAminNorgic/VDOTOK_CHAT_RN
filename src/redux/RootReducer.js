import {combineReducers} from 'redux';
import groupReducer from './groups/reducer';

import userReducer from './user/reducer';

const RootReducer = combineReducers({
  user: userReducer,
  group:groupReducer
});

export default RootReducer;