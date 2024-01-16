import { gql } from '@apollo/client';

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

export { GET_ALL_PERSONS, FIND_PERSON, CREATE_PERSON, EDIT_NUMBER };
