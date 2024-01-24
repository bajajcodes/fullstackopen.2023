import { useMutation } from '@apollo/client';
import React from 'react';
import { GET_AUTHORS, UPDATE_AUTHOR_BIRTH_YEAR } from '../queries';

const KEYS = ['name', 'setBornTo'];

const SetBornTo = (props) => {
  const ref = React.useRef(null);
  const authors = Object.keys(props.authorWithBirthYears);
  const [EditAuthor] = useMutation(UPDATE_AUTHOR_BIRTH_YEAR, {
    refetchQueries: [{ query: GET_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n');
      console.error({messages, error});
    },
  });
  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const variables = KEYS.reduce(
      (acc, key) => ({ ...acc, [key]: formData.get(key) }),
      {}
    );
    variables.setBornTo = parseInt(variables.setBornTo, 10);

    EditAuthor({ variables });

    event.currentTarget.reset();
  };
  const change = (event) => {
    if (event.target.name !== 'selectedAuthor') {
      return;
    }
    ref.current.elements.setBornTo.value =
      props.authorWithBirthYears[event.target?.value];
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit} onChange={change} ref={ref}>
        <label>
          name
          <select name="name">
            <option value="">Choose a author</option>
            {authors.map((author) => (
              <option value={author} key={author}>
                {author}
              </option>
            ))}
          </select>
        </label>
        <div>
          born
          <input
            type="number"
            name="setBornTo"
            placeholder="write setBornTo here..."
            required
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default SetBornTo;
