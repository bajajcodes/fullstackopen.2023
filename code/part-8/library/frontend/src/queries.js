import { gql } from '@apollo/client';

const GET_AUTHORS = gql`
  query AllAuthors {
    allAuthors {
      born
      id
      name
    }
  }
`;

const GET_BOOKS = gql`
  query AllBooks {
    allBooks {
      author {
        name
        id
        born
      }
      genres
      id
      title
      published
    }
  }
`;

const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      published
      id
      genres
      author
    }
  }
`;

const UPDATE_AUTHOR_BIRTH_YEAR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      born
      name
      bookCount
      id
    }
  }
`;

const GET_AUTHORS_BIRTH_YEAR = gql`
  query AllAuthorsBirthYear {
    allAuthors {
      name
      born
    }
  }
`;

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export {
  GET_AUTHORS,
  GET_BOOKS,
  GET_AUTHORS_BIRTH_YEAR,
  ADD_BOOK,
  LOGIN,
  UPDATE_AUTHOR_BIRTH_YEAR,
};
