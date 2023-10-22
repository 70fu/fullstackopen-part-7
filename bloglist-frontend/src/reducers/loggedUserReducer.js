import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import {
  showSuccessNotification,
  showErrorNotification,
} from "./notificationReducer";

const userStorageKey = "loggedInBlogUser";

const initialState = null;

const loggedUserSlice = createSlice({
  name: "loggedUser",
  initialState,
  reducers: {
    setUserToken(state, action) {
      return action.payload;
    },
    loadFromStorage(state, action) {
      const userString = window.localStorage.getItem(userStorageKey);
      if (userString) {
        const user = JSON.parse(userString);
        return user;
      }
    },
    clearUserToken(state, action) {
      window.localStorage.removeItem(userStorageKey);
      return null;
    },
  },
});

export const { setUserToken, loadFromStorage, clearUserToken } =
  loggedUserSlice.actions;

export function login(username, password) {
  return async (dispatch) => {
    console.log("logging in");
    try {
      const token = await loginService.login(username, password);
      if (token) {
        console.log("login successful");
        //store in browser
        window.localStorage.setItem(userStorageKey, JSON.stringify(token));

        //show notification
        dispatch(showSuccessNotification("Successfully logged in"));

        //store user token in store
        dispatch(setUserToken(token));
      } else {
        console.log("login unsuccessful");
        dispatch(showErrorNotification("Login unsuccessful"));
      }
    } catch (error) {
      console.log(error);
      dispatch(showErrorNotification("wrong username or password"));
    }
  };
}

export function logout() {
  return (dispatch) => {
    console.log("logging out");

    dispatch(clearUserToken());

    console.log("logged out");
    dispatch(showSuccessNotification("Successfully logged out"));
  };
}

export default loggedUserSlice.reducer;
