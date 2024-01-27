import { gql } from '@apollo/client';

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    author {
      name
      born
      id
    }
  }
`;

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
      ...AuthorDetails
      genres
      id
      title
      published
    }
  }
  ${AUTHOR_DETAILS}
`;

const GET_GENRES = gql`
  query GetGenres {
    allGenres
  }
`;

const GET_USER = gql`
  query GetUser {
    me {
      favoriteGenre
      id
      username
    }
  }
`;

const GET_FAVOURITE_GENRE_BOOKS = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      ...AuthorDetails
      genres
      id
      published
      title
    }
  }
  ${AUTHOR_DETAILS}
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
      author {
        name
        born
        id
      }
      genres
      id
      published
      title
    }
  }
`;

const UPDATE_AUTHOR_BIRTH_YEAR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      born
      name
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
  LOGIN,
  ADD_BOOK,
  UPDATE_AUTHOR_BIRTH_YEAR,
  GET_GENRES,
  GET_AUTHORS,
  GET_BOOKS,
  GET_AUTHORS_BIRTH_YEAR,
  GET_USER,
  GET_FAVOURITE_GENRE_BOOKS,
};
