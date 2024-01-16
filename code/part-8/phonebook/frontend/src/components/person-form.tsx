import React from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PERSON, GET_ALL_PERSONS } from '../queries';

const KEYS = ['name', 'phone', 'street', 'city'];

const PersonForm = () => {
  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: GET_ALL_PERSONS }],
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const variables = KEYS.reduce(
      (acc, key) => ({ ...acc, [key]: formData.get(key) }),
      {}
    );
    console.log({ variables });
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
          phone{' '}
          <input name="phone" placeholder="write your phone here..." required />
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
