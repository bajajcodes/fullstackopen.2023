import { useMutation } from '@apollo/client';
import React from 'react';
import {
  ADD_BOOK,
  GET_AUTHORS,
  GET_BOOKS,
  GET_FAVOURITE_GENRE_BOOKS,
} from '../queries';

const KEYS = ['title', 'author', 'published'];

//INFO: update(update-cache) and refetch queries are not working
const NewBook = () => {
  const ref = React.useRef(null);
  const [genres, setGenres] = React.useState([]);
  const [AddBook] = useMutation(ADD_BOOK, {
    refetchQueries: [
      { query: GET_AUTHORS },
      { query: GET_FAVOURITE_GENRE_BOOKS },
    ],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n');
      console.error({ messages, error });
    },
    // update: (cache, response) => {
    //   cache.updateQuery({ query: GET_FAVOURITE_GENRE_BOOKS }, (props) => {
    //     console.log({ props, response, cache });
    //     return {
    //       allBooks: props.allBooks.concat(response.data.addBook),
    //     };
    //   });
    // },
  });
  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const variables = KEYS.reduce(
      (acc, key) => ({ ...acc, [key]: formData.get(key) }),
      {}
    );
    variables.genres = genres;
    variables.published = parseInt(variables.published, 10);

    AddBook({ variables });

    event.currentTarget.reset();
    setGenres([]);
  };

  const addGenre = () => {
    const genre = ref.current.elements.genre;
    const value = genre.value;
    if (!value) return;
    genre.value = '';
    setGenres((p) => [...p, value]);
  };

  return (
    <div>
      <form onSubmit={submit} ref={ref}>
        <div>
          title
          <input name="title" placeholder="write title here..." required />
        </div>
        <div>
          author
          <input name="author" placeholder="write author here..." required />
        </div>
        <div>
          published
          <input
            type="number"
            name="published"
            placeholder="write published here..."
            required
          />
        </div>
        <div>
          <input
            name="genre"
            placeholder="write genre here..."
            required={genres.length < 1}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
