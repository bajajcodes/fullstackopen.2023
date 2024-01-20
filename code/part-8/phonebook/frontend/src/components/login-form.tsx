import React from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';
import { Token } from '../types';
import * as localstorageActions from '../util/local-storage';

const KEYS = ['username', 'password'];

export function LoginForm({
  setError,
  setToken,
}: {
  setError: (message: string) => void;
  setToken: (token: Token) => void;
}) {
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const variables = KEYS.reduce(
      (acc, key) => ({ ...acc, [key]: formData.get(key) }),
      {}
    );
    login({ variables });
    event.currentTarget.reset();
  };

  React.useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setError('');
      setToken(token);
      localstorageActions.setToken(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data]);

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          username <input aria-label="username" name="username" />
        </div>
        <div>
          password
          <input aria-label="password" type="password" name="password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
}
