import { useQuery } from '@apollo/client';
import { GET_AUTHORS } from '../queries';
import SetBornTo from './SetBornTo';

const Authors = (props) => {
  const { loading, data } = useQuery(GET_AUTHORS, {
    onError: (error) => {
      const message = error.graphQLErrors.map((e) => e.message).join(' \n');
      //TODO: pass setError function
      props?.setError(message);
    },
  });

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const authorWithBirthYears = data.allAuthors.reduce(
    (acc, { name, born }) => ({ ...acc, [name]: born }),
    {}
  );

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a?.born || 'NA'}</td>
              <td>{a?.bookCount || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBornTo authorWithBirthYears={authorWithBirthYears} />
    </div>
  );
};

export default Authors;
