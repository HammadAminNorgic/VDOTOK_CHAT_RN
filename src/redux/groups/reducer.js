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

const initialState = {
  groups: [],
  currentChannel: null,
  onlineUsers: {},
  allRoomsMessages: {},
  sendingQueue: [],
  allUsers: [],
  typingUsers: {},
  filesObject: {},
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_GROUPS:
      return {
        ...state,
        groups: action.payload,
      };
    case SELECT_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload,
      };
    case STORE_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.payload,
      };
    case STORE_ALL_MESSAGES:
      return {
        ...state,
        allRoomsMessages: action.payload,
      };
    case STORE_SENDING_QUEUE:
      return {
        ...state,
        sendingQueue: action.payload,
      };
    case STORE_ALL_USERS:
      return {
        ...state,
        allUsers: action.payload,
      };

    case STORE_TYPING_USERS:
      return {
        ...state,
        typingUsers: action.payload,
      };
    case STORE_FILE_OBJECT:
      return {
        ...state,
        filesObject: action.payload,
      };
    case CLEAR_ALL_DATA:
      return {
        ...state,
        groups: [],
        currentChannel: null,
        onlineUsers: {},
        allRoomsMessages: {},
        sendingQueue: [],
        allUsers: [],
        typingUsers: {},
        filesObject: {},
      };
    default:
      return state;
  }
};

export default groupReducer;
