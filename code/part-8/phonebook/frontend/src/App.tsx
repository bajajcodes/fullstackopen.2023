import React from 'react';
import './App.css';
import { gql, useQuery } from '@apollo/client';
import { Person } from './components/person';
import type { PersonInterface } from './types';

const GET_ALL_PERSONS = gql`
  query {
    allPersons {
      name
      id
    }
  }
`;

const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`;

function App() {
  const [nameToSearch, setNameToSearch] = React.useState<string | null>(null);
  const { data: persons, loading: loadingPersons } = useQuery<{
    allPersons: Array<PersonInterface>;
  }>(GET_ALL_PERSONS);
  const { data: person, loading: loadingPerson } = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch,
  });

  if (loadingPerson || loadingPersons) {
    return <h2>Loading...</h2>;
  }

  if (nameToSearch && person) {
    return (
      <Person
        person={person.findPerson}
        onClose={() => setNameToSearch(null)}
      />
    );
  }

  return (
    <section>
      <h2>Persons</h2>
      <ul>
        {persons?.allPersons.map((p) => (
          <li key={p.id}>
            {p.name}&nbsp;
            <button onClick={() => setNameToSearch(p.name)} type="button">
              show address
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default App;
