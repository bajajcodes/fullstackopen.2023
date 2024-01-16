const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { v1: uuid } = require('uuid');

const realmans = [];

const authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
];

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
];

const typeDefs = `
  type Book {
    title: String!
    published: Int
    genres: [String!]
    author: ID!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID!
  }

  type Qualities {
    fit: Boolean
    rich: Boolean
    smart: Boolean
  }

  type RealMan {
    name: String!
    email: String!
    username: String!
    fit: Boolean!
    rich: Boolean!
    smart: Boolean!
    id: ID!
  }


  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
    allRealMans: [RealMan!]
  }

  type Mutation{
    addBook(title: String!, author: String!, published: Int!, genres: [String!]):Book
    editAuthor(name: String!, setBornTo: Int!): Author
    addRealMan(name: String!, email: String!, username: String!, fit: Boolean!, rich: Boolean!, smart: Boolean!): RealMan
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
    allRealMans: () => realmans,
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
    addRealMan: (_, args) => {
      realmans.push(args);
      return args;
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
