import { gql } from '@apollo/client';

const PERSON_DETAILS = gql`
  fragment PersonDetails on Person {
    name
    phone
    id
    address {
      street
      city
    }
  }
`;

const GET_ALL_PERSONS = gql`
  query {
    allPersons {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`;

const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`;

const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`;

const EDIT_NUMBER = gql`
  mutation changeNumber($name: String!, $phone: String!) {
    editNumber(name: $name, phone: $phone) {
      name
      phone
      address {
        city
        street
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export {
  GET_ALL_PERSONS,
  FIND_PERSON,
  CREATE_PERSON,
  EDIT_NUMBER,
  PERSON_DETAILS,
};
