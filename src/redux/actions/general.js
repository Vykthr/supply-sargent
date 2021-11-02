import { SET_ALL, SET_UTILITIES, SET_PRODUCTS, SET_USERS, SET_FEEDS } from "../actions/constants";
import generalApi from "../api/general";

export const fetchAll = () => {
  return async (dispatch) => {
    try {
      const utilities = await generalApi.fetchUtilities();
      const products = await generalApi.fetchProducts();
      const users = await generalApi.fetchUsers();
      const feeds = await generalApi.getNewsFeeds();

    //   console.log(users)
      const payload = {
        utilities, products, users, feeds
      }
      await dispatch({
        type: SET_ALL,
        payload: payload,
      });
      return Promise.resolve(payload);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const fetchProducts = () => {
  return async (dispatch) => {
    try {
      const products = await generalApi.fetchProducts();

      await dispatch({
        type: SET_PRODUCTS,
        payload: products,
      });
      return Promise.resolve(products);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const fetchUtilities = () => {
  return async (dispatch) => {
    try {
      const utilities = await generalApi.fetchUtilities();

      await dispatch({
        type: SET_UTILITIES,
        payload: utilities,
      });
      return Promise.resolve(utilities);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const fetchUsers = () => {
  return async (dispatch) => {
    try {
      const users = await generalApi.fetchUsers();

      await dispatch({
        type: SET_USERS,
        payload: users,
      });
      return Promise.resolve(users);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const fetchNewsFeeds = () => {
  return async (dispatch) => {
    try {
      const feeds = await generalApi.getNewsFeeds();

      await dispatch({
        type: SET_FEEDS,
        payload: feeds,
      });
      return Promise.resolve(feeds);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};


