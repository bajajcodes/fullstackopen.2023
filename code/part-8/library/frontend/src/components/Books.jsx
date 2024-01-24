import { useQuery } from '@apollo/client';
import { GET_BOOKS } from '../queries';

const Books = (props) => {
  const { loading, data } = useQuery(GET_BOOKS, {
    onError: (error) => {
      const message = error.graphQLErrors.map((e) => e.message).join(' \n');
      //TODO: pass setError function
      props?.setError(message);
    },
  });

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {data.allBooks.map((a) => (
            <tr key={a.title}>
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

export default Books;
