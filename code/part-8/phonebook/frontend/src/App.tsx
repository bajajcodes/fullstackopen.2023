import React from 'react';
import { useQuery } from '@apollo/client';
import './App.css';
import { Person } from './components/person';
import type { ErrorMessage, PersonInterface, Token } from './types';
import { PersonForm } from './components/person-form';
import { FIND_PERSON, GET_ALL_PERSONS } from './queries';
import { Notify } from './components/notify';
import { PhoneForm } from './components/phone-form';
import { LoginForm } from './components/login-form';
import { LoginStatus } from './components/login-status';

function App() {
  const [errorMessage, setErrorMessage] = React.useState<ErrorMessage>(null);
  const [nameToSearch, setNameToSearch] = React.useState<string | null>(null);
  const [token, setToken] = React.useState<Token>(null);
  const { data: persons, loading: loadingPersons } = useQuery<{
    allPersons: Array<PersonInterface>;
  }>(GET_ALL_PERSONS);
  const { data: person, loading: loadingPerson } = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch,
  });

  const notify = (message: string | null) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  if (loadingPerson || loadingPersons) {
    return <h2>Loading...</h2>;
  }

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setError={notify} setToken={setToken} />
      </>
    );
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
      <Notify errorMessage={errorMessage} />
      <LoginStatus token={token} setToken={setToken} />
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
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </section>
  );
}

export default App;
