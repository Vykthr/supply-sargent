import { USER_LOGOUT, USER_LOGIN, USER_UPDATE, UPDATE_CART, UPDATE_CHAT_LIST } from "../actions/constants";

const userData = JSON.parse(localStorage.getItem("supply-sargent"));

const defaultState = {
  authenticated: !!userData,
  userData: userData,
  cartList: [],
  chatList: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case USER_LOGOUT:
      return defaultState;
    case USER_LOGIN:
      return { ...state, authenticated: true, userData: action.payload };
    case USER_UPDATE:
      return { ...state, userData: action.payload };
    case UPDATE_CART:
      return { ...state, cartList: action.payload };
    case UPDATE_CHAT_LIST:
      return { ...state, chatList: action.payload };
    default:
      return state;
  }
};
