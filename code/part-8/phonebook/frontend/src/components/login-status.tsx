import { useApolloClient } from '@apollo/client';
import { clearToken } from '../util/local-storage';
import React from 'react';
import { Token } from '../types';

function LoginStatus({
  token,
  setToken,
}: {
  token: Token;
  setToken: React.Dispatch<React.SetStateAction<Token>>;
}) {
  const client = useApolloClient();
  if (!token) return null;

  const logout = () => {
    setToken(null);
    clearToken();
    client.resetStore();
  };
  return (
    <button type="button" onClick={logout}>
      Logout
    </button>
  );
}

export { LoginStatus };
