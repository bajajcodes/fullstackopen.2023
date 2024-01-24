import { useQuery } from '@apollo/client';
import { GET_BOOKS, GET_FAVOURITE_GENRE_BOOKS, GET_GENRES } from '../queries';
import React from 'react';

const Books = (props) => {
  const [filter, setFilter] = React.useState(null);
  const { loading, data } = useQuery(GET_FAVOURITE_GENRE_BOOKS, {
    variables: { genre: filter },
    onError: (error) => {
      const message = error.graphQLErrors.map((e) => e.message).join(' \n');
      console.error({ message });
      //TODO: pass setError function
      props?.setError(message);
    },
  });
  const { loading: genresLoading, data: genresData } = useQuery(GET_GENRES, {
    onError: (error) => {
      const message = error.graphQLErrors.map((e) => e.message).join(' \n');
      console.error({ message });
      //TODO: pass setError function
      props?.setError(message);
    },
  });

  const updateFilter = (filter) => {
    setFilter(filter);
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  console.log({ data });

  const allBooks =
    filter === null
      ? data.allBooks
      : data.allBooks.filter((book) => book.genres.includes(filter));

  console.log({ allBooks });

  return (
    <div>
      <h2>books</h2>
      <p>
        is genre <strong>{filter || 'AllGenres'}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!genresLoading && (
        <ul style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {genresData &&
            genresData.allGenres.map((genre) => (
              <li key={genre} style={{ listStyle: 'none' }}>
                <button onClick={() => updateFilter(genre)}>{genre}</button>
              </li>
            ))}
          <li style={{ listStyle: 'none' }}>
            <button onClick={() => updateFilter(null)}>AllGenres</button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Books;
