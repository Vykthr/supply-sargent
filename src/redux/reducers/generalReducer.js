import { SET_ALL, SET_UTILITIES, SET_PRODUCTS, SET_USERS, SET_FEEDS } from "../actions/constants";

const defaultState = {
    utilities: {
    },
    news: [],
    users: [],
    products: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_ALL:
      return { ...state, 
        utilities: action.payload.utilities,
        products: action.payload.products,
      };
    case SET_UTILITIES:
      return { ...state, utilities: action.payload };
    case SET_PRODUCTS:
      return { ...state, products: action.payload };
    case SET_USERS:
      return { ...state, users: action.payload };
    case SET_FEEDS:
      return { ...state, news: action.payload };
    default:
      return state;
  }
};
