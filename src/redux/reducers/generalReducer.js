import { SET_ALL, SET_UTILITIES, SET_PRODUCTS } from "../actions/constants";

const defaultState = {
    utilities: {
    },
    news: [],
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
    default:
      return state;
  }
};
