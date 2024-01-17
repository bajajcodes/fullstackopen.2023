const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { v1: uuid } = require('uuid');

const typeDefs = `
type Author {
  name: String!
  born: Int
  bookCount: Int
  id: ID!
 }

  type Book {
    title: String!
    published: Int!
    genres: [String!]
    author: Author!
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
  }

  type Mutation{
    addBook(title: String!, author: String!, published: Int!, genres: [String!]):Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (_, args) => {
      const authorName = args?.author;
      let authorId = authors.find((author) => author.name === authorName)?.id;
      const genre = args?.genre;
      const genreCb = (book) => book.genres.includes(genre);
      const authorCb = (book) => book.author === authorId;

      let filteredBooks = books.slice();

      if (authorId) {
        filteredBooks = filteredBooks.filter(authorCb);
      }

      if (genre) {
        filteredBooks = filteredBooks.filter(genreCb);
      }

      return filteredBooks;
    },
    allAuthors: () => authors,
  },
  Book: {
    title: (root) => root.title,
    published: (root) => root.published,
    genres: (root) => root.genres,
    author: (root) => authors.find((a) => a.id === root.author).name,
    id: (root) => root.id,
  },
  Author: {
    bookCount: (root) =>
      books.reduce((acc, book) => (book.author === root.id ? ++acc : acc), 0),
  },
  Mutation: {
    addBook: (_, args) => {
      let author = authors.find((a) => a.name === args.author);
      if (!author) {
        author = {
          name: args.author,
          id: uuid(),
        };
        authors.push(author);
      }
      const book = {
        ...args,
        author: author.id,
        id: uuid(),
      };
      books.push(book);
      return book;
    },
    editAuthor: (_, args) => {
      const index = authors.findIndex((e) => e.name === args.name);
      if (index < 0) return null;
      const author = authors[index];
      const updatedAuthor = { ...author, born: args.setBornTo };
      authors.splice(index, 1, updatedAuthor);
      return updatedAuthor;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
