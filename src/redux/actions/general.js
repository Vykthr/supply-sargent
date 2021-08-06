import { SET_ALL, SET_UTILITIES, SET_PRODUCTS } from "../actions/constants";
import generalApi from "../api/general";

export const fetchAll = () => {
  return async (dispatch) => {
    try {
      const utilities = await generalApi.fetchUtilities();
      const products = await generalApi.fetchProducts();
      const payload = {
        utilities, products
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


