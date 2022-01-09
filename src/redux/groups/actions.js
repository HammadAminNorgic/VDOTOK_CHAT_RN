import {
    STORE_GROUPS,
    SELECT_CURRENT_CHANNEL,
    STORE_ONLINE_USERS,
    STORE_ALL_MESSAGES,
    STORE_SENDING_QUEUE,
    STORE_ALL_USERS,
    STORE_TYPING_USERS,
    STORE_FILE_OBJECT,
    CLEAR_ALL_DATA
  } from './types';

  
  export const storeGroups = (data) => async (dispatch) => {
    dispatch({
      type: STORE_GROUPS,
      payload:data
    });
  };

  export const selectCurrentChannel = (data) => async (dispatch) => {
    dispatch({
      type: SELECT_CURRENT_CHANNEL,
      payload:data
    });
  };

  export const manageOnlineUsers = (data) => async (dispatch) => {
    dispatch({
      type: STORE_ONLINE_USERS,
      payload:data
    });
  };

  export const manageAllMessages = (data) => async (dispatch) => {
    dispatch({
      type: STORE_ALL_MESSAGES,
      payload:data
    });
  };

  export const manageSendingQueue = (data) => async (dispatch) => {
    dispatch({
      type: STORE_SENDING_QUEUE,
      payload:data
    });
  };

  export const storeAllUsers = (data) => async (dispatch) => {
    dispatch({
      type: STORE_ALL_USERS,
      payload:data
    });
  };
  export const manageTypingUsers = (data) => async (dispatch) => {
    dispatch({
      type: STORE_TYPING_USERS,
      payload:data
    });
  };
  export const manageFilesObject = (data) => async (dispatch) => {
    dispatch({
      type: STORE_FILE_OBJECT,
      payload:data
    });
  };
  export const clearAllData = () => async (dispatch) => {
    dispatch({
      type: CLEAR_ALL_DATA,
    });
  };