import React from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_NUMBER, GET_ALL_PERSONS } from '../queries';
import { KEYS } from '../constants';

const PhoneForm = ({ setError }: { setError: (message: string) => void }) => {
  const [changeNumber, result] = useMutation(EDIT_NUMBER, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n');
      setError(messages);
    },
    update: (cache, response) => {
      cache.updateQuery({ query: GET_ALL_PERSONS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(response.data.editNumber),
        };
      });
    },
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const variables = KEYS.reduce(
      (acc, key) =>
        formData.has(key) ? { ...acc, [key]: formData.get(key) } : acc,
      {}
    );
    changeNumber({ variables });
    event.currentTarget.reset();
  };

  React.useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setError('person not found');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data]);

  return (
    <div>
      <h2>change number</h2>

      <form onSubmit={submit}>
        <div>
          name <input name="name" placeholder="name here..." required />
        </div>
        <div>
          phone <input name="phone" placeholder="phone here..." required />
        </div>
        <button type="submit">change number</button>
      </form>
    </div>
  );
};

export { PhoneForm };
