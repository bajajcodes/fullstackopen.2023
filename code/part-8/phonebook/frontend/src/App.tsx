import React from 'react';
import { useQuery } from '@apollo/client';
import './App.css';
import { Person } from './components/person';
import type { PersonInterface } from './types';
import { PersonForm } from './components/person-form';
import { FIND_PERSON, GET_ALL_PERSONS } from './queries';

function App() {
  const [nameToSearch, setNameToSearch] = React.useState<string | null>(null);
  const { data: persons, loading: loadingPersons } = useQuery<{
    allPersons: Array<PersonInterface>;
  }>(GET_ALL_PERSONS, {
    // pollInterval: 2000,
  });
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
      <PersonForm />
    </section>
  );
}

export default App;
