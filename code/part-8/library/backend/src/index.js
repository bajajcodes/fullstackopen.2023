import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Book } from './models/book.js';
import { Author } from './models/author.js';
import { User } from './models/user.js';
import * as config from './utils/config.js';
import * as logger from './utils/logger.js';

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

//TODO: populate Book with author details
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
    author: Author
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
    me: User
  }

  type Mutation{
    addBook(title: String!, author: String!, published: Int!, genres: [String!]):Book
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
    addAuthor(name: String!, born: Int): Author
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_, args) => {
      const conditions = [];

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        const authorId = author._id.toString();
        conditions.push({
          author: { $eq: authorId },
        });
      }

      if (args.genre) {
        conditions.push({
          genres: { $eq: args.genre },
        });
      }
      const findQuery =
        conditions.length < 1
          ? {}
          : {
              $or: conditions,
            };

      return await Book.find(findQuery);
    },
    allAuthors: async () => await Author.find({}),
    allUsers: async () => await User.find({}),
    me: async (root, args, context) => context?.currentUser || null,
  },
  Book: {
    title: (root) => root.title,
    published: (root) => root.published,
    genres: (root) => root.genres,
    //TODO: use populate method
    author: async (root) => {
      logger.info({ root });
      const author = await Author.findById(root.author);
      logger.info({ author });
      return author;
    },
    id: (root) => root.id,
  },
  Mutation: {
    addBook: async (_, { author: authorName, ...rest }, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      let author = await Author.findOne({ name: authorName });
      try {
        if (!author) {
          author = new Author({
            name: authorName,
          });
          await author.save();
        }
        const book = new Book({
          ...rest,
          author: author._id.toString(),
        });
        return await book.save();
      } catch (error) {
        throw new GraphQLError('Failed To Add Book', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        });
      }
    },
    editAuthor: async (_, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      try {
        const author = await Author.findOne({ name: args.name });
        if (!author) {
          return null;
        }
        author.born = args.setBornTo;
        return await author.save();
      } catch (error) {
        throw new GraphQLError('Edit Author Failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        });
      }
    },
    createUser: async (_, args) => {
      logger.info(args);
      const user = new User(args);
      try {
        return await user.save();
      } catch (error) {
        logger.info({ error });
        const errorMessage = error.message;
        const messageWithSplit = errorMessage.split(':');
        const code = messageWithSplit[0];
        const invalidArgs = messageWithSplit[1];
        const message = messageWithSplit[2];
        throw new GraphQLError(message, {
          extensions: {
            code,
            error,
            invalidArgs,
          },
        });
      }
    },
    login: async (_, args) => {
      try {
        const user = await User.find({ username: args.username });
        if (!user || args.password !== 'secret') {
          throw new Error(
            `Wrong Credentials user:${user} or password does not match`
          );
        }
        const userForToken = {
          username: user.username,
          id: user._id,
        };
        const token = jwt.sign(userForToken, config.JWT_SECRET);

        return { value: token };
      } catch (error) {
        throw new GraphQLError('Wrong Credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        });
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req.headers?.authorization || null;
    if (!auth || !auth.startsWith('Bearer ')) return;
    const token = auth.substring(7);
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    const currentUser = await User.findById(decodedToken.id);
    return {
      currentUser,
    };
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});