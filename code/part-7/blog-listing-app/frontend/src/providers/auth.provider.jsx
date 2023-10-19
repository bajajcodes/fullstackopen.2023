import { useReducer } from "react";
import AuthContext from "../contexts/auth.context";
import loginService from "../service/login.service";
import constants from "../utils/constants";
import blogService from "../service/blog.service";

const initialState = null;

function reducer(_, action) {
  switch (action.type) {
    case "login":
      return action.payload;
    case "logout":
    default:
      return initialState;
  }
}

export default function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function login(credentials) {
    const user = await loginService.login(credentials);
    window.localStorage.setItem(
      constants.BROWSER_STORAGE_USER_NAME_kEY,
      JSON.stringify(user)
    );
    blogService.setToken(user.token);
    dispatch({ type: "login", payload: user });
  }

  function logout() {
    window.localStorage.removeItem(constants.BROWSER_STORAGE_USER_NAME_kEY);
    dispatch({ type: "logout" });
  }

  function getLoggedInUserInfo() {
    return state;
  }

  function reLoginUser() {
    const loggedUserJSON = window.localStorage.getItem(
      constants.BROWSER_STORAGE_USER_NAME_kEY
    );
    const user = JSON.parse(loggedUserJSON);
    if (user) {
      blogService.setToken(user.token);
    }
    dispatch({ type: "login", payload: user });
  }

  function isUserLoggedIn() {
    return state !== null;
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        reLoginUser,
        getLoggedInUserInfo,
        isUserLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
