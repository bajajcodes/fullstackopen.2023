import { createSlice } from "@reduxjs/toolkit";
import constants from "../utils/constants";
import blogService from "../service/blog.service";
import loginService from "../service/login.service";

/**
 * token: string,
 * username: string,
 * name: string
 */
const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser() {
      window.localStorage.removeItem(constants.BROWSER_STORAGE_USER_NAME_kEY);
      return null;
    },
    reLoginUser() {
      const loggedUserJSON = window.localStorage.getItem(
        constants.BROWSER_STORAGE_USER_NAME_kEY
      );
      const user = JSON.parse(loggedUserJSON);
      if (user) {
        blogService.setToken(user.token);
      }
      return user;
    },
    loginUser(_, action) {
      const user = action.payload;
      window.localStorage.setItem(
        constants.BROWSER_STORAGE_USER_NAME_kEY,
        JSON.stringify(user)
      );
      blogService.setToken(user.token);
      return user;
    },
  },
});

const userReducer = userSlice.reducer;
const { logoutUser, reLoginUser, loginUser } = userSlice.actions;

const loginUserAC = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials);
    dispatch(loginUser(user));
  };
};

export default userReducer;
export { loginUserAC, logoutUser, reLoginUser };
