import {
    STORE_USER_INFO,
    LOGOUT
  } from './types';

  
  export const storeUserInfo = (data) => async (dispatch) => {
    // console.log('before dispatch==>',data);
    dispatch({
      type: STORE_USER_INFO,
      payload:data
    });
  };

  export const logoutUser = () => async (dispatch) => {
    dispatch({
      type: LOGOUT
    });
  };
