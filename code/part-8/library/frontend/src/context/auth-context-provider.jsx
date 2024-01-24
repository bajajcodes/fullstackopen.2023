import React from 'react';
import * as AuthLocalStorage from '../utils/local-storage';
import { AuthContext } from './auth-context';

export const AuthContextProvider = (props) => {
  const [token, setState] = React.useState(null);

  const getToken = () => token;

  const signout = async () => {
    const accessToken = AuthLocalStorage.getToken();
    if (!accessToken) {
      throw Error('Missing AccessToken');
    }
    AuthLocalStorage.clearToken();
    setState(null);
  };

  const signin = (access_token) => {
    AuthLocalStorage.setToken(access_token);
    setState(access_token);
  };

  console.log({ token });

  return (
    <AuthContext.Provider
      value={{
        getToken,
        signout,
        signin,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
