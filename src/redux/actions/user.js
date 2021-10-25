import { USER_LOGIN, USER_LOGOUT, USER_UPDATE, UPDATE_CART } from "./constants";
import userApi from "../api/user";

export const loginUser = (payload, checked) => {
  return async (dispatch) => {
    try {
      const response = await userApi.loginUser(payload);
      if(response) {
        const userData = await (await userApi.getUserData(payload.email)).data();
        localStorage.setItem("supply-sargent", JSON.stringify(userData));
        await dispatch({
          type: USER_LOGIN,
          payload: userData,
        });
        return Promise.resolve(userData);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const updateProfile = (email, payload = null) => {
  return async (dispatch) => {
    try {
        if(payload) await userApi.updateProfile(email, payload);
        const res = await userApi.getUserData(email);
        const userData = res.data()
        localStorage.setItem("supply-sargent", JSON.stringify(userData));
        await dispatch({
          type: USER_LOGIN,
          payload: userData,
        });
        return Promise.resolve(userData);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const addToCart = (cartList) => {
  return async (dispatch) => {
    try {
        await dispatch({
          type: UPDATE_CART,
          payload: cartList,
        });
        return Promise.resolve(cartList);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    try {
        localStorage.removeItem("supply-sargent");
        window.location.href = '/'
        userApi.logoutUser();
        await dispatch({
            type: USER_LOGOUT
        });
      return Promise.resolve('Successful');
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  };
};
