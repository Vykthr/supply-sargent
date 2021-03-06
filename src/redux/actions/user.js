import { USER_LOGIN, USER_LOGOUT, USER_UPDATE, UPDATE_CART, UPDATE_CHAT_LIST } from "./constants";
import userApi from "../api/user";
import moment from 'moment'
import firebase from "../api/config";

export const loginUser = (payload, checked) => {
  return async (dispatch) => {
    try {
      const response = await userApi.loginUser(payload);
      if(response) {
        let userData = await (await userApi.getUserData(payload.email)).data();
        userData['freeTrial'] = userData?.registered ? 
            (moment(userData?.registered).fromNow() < '3 Months ago') ? true : false            
        : false
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
            let userData = res.data()

            const fromNow = moment(userData?.registered).add(3, 'M');

            userData['freeTrial'] = userData?.registered ? Boolean(fromNow > userData?.registered) : false
            
            localStorage.setItem("supply-sargent", JSON.stringify(userData));
            
            await dispatch({
                type: USER_UPDATE,
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
