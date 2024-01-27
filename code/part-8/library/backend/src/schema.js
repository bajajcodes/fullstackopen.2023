const typeDefs = `

type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Author {
  name: String!
  born: Int
  id: ID!
 }

  type Book {
    title: String!
    published: Int!
    genres: [String!]
    author: String!
    id: ID!
  }

  type Qualities {
    fit: Boolean
    rich: Boolean
    smart: Boolean
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
    allUsers: [User!]
    allGenres: [String!]!
    me: User
  }

  type Mutation{
    addBook(title: String!, author: String!, published: Int!, genres: [String!]):Book
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
    addAuthor(name: String!, born: Int): Author
    editAuthor(name: String!, setBornTo: Int!): Author
  }

  type Subscription{
    bookAdded: Book!
  }
`;

export default typeDefs;
