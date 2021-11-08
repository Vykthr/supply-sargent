import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { composeWithDevTools } from 'redux-devtools-extension';

const DEV = process.env.NODE_ENV !== "production";


let middleware = [thunk];
let composeEnhancers = compose;

if (DEV) {
  composeEnhancers = composeWithDevTools || compose;
}

let composers = [applyMiddleware(...middleware)];

const initStore = (initialState) => {
  const reducer = combineReducers(rootReducer);
  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(...composers)
  );
  return store;
};

export default initStore;
