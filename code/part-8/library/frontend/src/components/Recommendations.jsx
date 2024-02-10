import { useQuery } from '@apollo/client';
import { GET_FAVOURITE_GENRE_BOOKS, GET_USER } from '../queries';
import React, { useEffect } from 'react';

const Recommendations = (props) => {
  const [genre, setGenreToGet] = React.useState(null);
  const { loading, data } = useQuery(GET_USER, {
    onError: (error) => {
      const message = error.graphQLErrors.map((e) => e.message).join(' \n');
      console.error({ message });
      //TODO: pass setError function
      props?.setError(message);
    },
  });

  const { loading: booksLoading, data: booksData } = useQuery(
    GET_FAVOURITE_GENRE_BOOKS,
    {
      variables: { genre },
      skip: !data?.me?.id,
      onError: (error) => {
        const message = error.graphQLErrors.map((e) => e.message).join(' \n');
        console.error({ message });
        //TODO: pass setError function
        props?.setError(message);
      },
    }
  );

  useEffect(() => {
    if (!data?.me) return;
    setGenreToGet(data.me.favoriteGenre);
  }, [data]);

  if (loading || booksLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        your favourite genre <strong>{data.me.favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksData.allBooks.map((a) => (
            <tr key={a.author.name}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
