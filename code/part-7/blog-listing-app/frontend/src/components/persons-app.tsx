import React, { useEffect, useState } from "react";
import Filter from "./filter";
import PersonForm from "./person-form";
import Persons from "./persons";
import personsService from "../services/persons";

export type Person = {
  name: string;
  number: string;
  id: string;
};

export type PersonsCollection = Array<Person>;

export interface PersonsAppProps {
  persons: PersonsCollection;
}

const PersonsApp = () => {
  const [persons, setPersons] = useState<PersonsCollection>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const number = formData.get("number") as string;
    const person = {
      name,
      number,
    };
    const prevPersonRecord = persons.find((p) => p.name === person.name);

    if (
      prevPersonRecord &&
      window.confirm(
        `${name} is already added to phonebook, replace the old number with new one?`
      )
    ) {
      personsService
        .update(prevPersonRecord.id, {
          ...prevPersonRecord,
          number,
        })
        .then((retunredPerson) => {
          setPersons(
            persons.map((p) =>
              p.id !== retunredPerson.id ? p : retunredPerson
            )
          );
          setErrorMessage("");
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error);
        });
    }

    if (!prevPersonRecord) {
      personsService
        .create(person)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setErrorMessage("");
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error);
        });
    }

    event.currentTarget.reset();
  }
  function handleFilterInputChange(value: string) {
    setSearchInput(value.toLowerCase());
  }
  function handleDeletePerson(id: string) {
    const person = persons.find((p) => p.id === id);
    if (!window.confirm(`Delete ${person?.name}`)) {
      return;
    }
    personsService.remove(id).then(() => {
      setPersons(persons.filter((p) => p.id !== id));
    });
  }

  const filteredPersons = persons.filter((p) => {
    const name = p.name.toLowerCase();
    return name.includes(searchInput);
  });

  useEffect(() => {
    personsService
      .getAll()
      .then((persons: PersonsCollection) => setPersons(persons));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      {errorMessage && (
        <section className="error-message">
          <h3>{errorMessage}</h3>
        </section>
      )}
      <Filter setSearchInput={handleFilterInputChange} />
      <h3>Add a new</h3>
      <PersonForm handleFormSubmit={handleFormSubmit} />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} onDelete={handleDeletePerson} />
    </div>
  );
};

export default PersonsApp;
