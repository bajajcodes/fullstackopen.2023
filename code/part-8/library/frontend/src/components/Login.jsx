import React from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';
import { useAuthContext } from '../context/auth-context';

const KEYS = ['username', 'password'];

export function LoginForm() {
  const { signin } = useAuthContext();
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.error(error.graphQLErrors[0].message);
      signin(null);
    },
  });

  const submit = async (event) => {
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
      console.log({ token });
      signin(token);
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
