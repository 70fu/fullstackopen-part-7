import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import { notifications } from "@mantine/notifications";

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
        notifications.show({
          title: "Login",
          message: "Successfully logged in",
        });

        //store user token in store
        dispatch(setUserToken(token));
      } else {
        console.log("login unsuccessful");
        notifications.show({
          color: "red",
          title: "Error",
          message: "Login unsuccessful",
        });
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        color: "red",
        title: "Error",
        message: "wrong username or password",
      });
    }
  };
}

export function logout() {
  return (dispatch) => {
    console.log("logging out");

    dispatch(clearUserToken());

    console.log("logged out");
    notifications.show({
      title: "Logout",
      message: "Successfully logged out",
    });
  };
}

export default loggedUserSlice.reducer;
