import React from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PERSON, GET_ALL_PERSONS } from '../queries';
import { KEYS } from '../constants';

const PersonForm = ({ setError }: { setError: (message: string) => void }) => {
  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: GET_ALL_PERSONS }],
    onError: (error) => {
      console.error({ error });
      const messages = error.graphQLErrors.map((e) => e.message).join('\n');
      setError(messages);
    },
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const variables: Record<string, string> = KEYS.reduce(
      (acc, key) => ({ ...acc, [key]: formData.get(key) }),
      {}
    );
    if (!variables['phone']) {
      delete variables['phone'];
    }
    createPerson({ variables });
    event.currentTarget.reset();
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          name{' '}
          <input name="name" placeholder="write your name here..." required />
        </div>
        <div>
          phone <input name="phone" placeholder="write your phone here..." />
        </div>
        <div>
          street{' '}
          <input
            name="street"
            placeholder="write your street here..."
            required
          />
        </div>
        <div>
          city{' '}
          <input name="city" placeholder="write your city here..." required />
        </div>
        <button type="submit">add!</button>
      </form>
    </div>
  );
};

export { PersonForm };
