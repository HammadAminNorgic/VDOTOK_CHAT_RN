import {
    STORE_USER_INFO,
    LOGOUT
  } from './types';
  
  const initialState = {
    user:null
  };
  
  const userReducer = (state = initialState, action) => {
    // console.log('in dispatch==>',action);
    switch (action.type) {
      case STORE_USER_INFO:
        return {
          ...state,
          user: action.payload,
        };
        case LOGOUT:
        return {
          ...state,
          user: null,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;