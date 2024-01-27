import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { PubSub } from 'graphql-subscriptions';
import { Book } from './models/book.js';
import { Author } from './models/author.js';
import { User } from './models/user.js';
import * as config from './utils/config.js';

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allGenres: async () => {
      const books = await Book.find(
        {},
        {
          genres: 1,
        }
      );
      const genres = Object.keys(
        books
          .flatMap((book) => book.genres)
          .reduce(
            (acc, genre) => (acc[genre] ? acc : { ...acc, [genre]: true }),
            {}
          )
      );
      return genres;
    },
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

      //TODO: populate author details
      return await Book.find(findQuery);
    },
    allAuthors: async () => await Author.find({}),
    allUsers: async () => await User.find({}),
    me: async (root, args, context) => context?.currentUser || null,
  },
  Book: {
    author: async (root) => {
      const author = await Author.findById(root.author);
      return author.name;
    },
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
        const bookAdded = await book.save();
        pubsub.publish('BOOK_ADDED', { bookAdded });
        return bookAdded;
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
      const user = new User(args);
      try {
        return await user.save();
      } catch (error) {
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
        const user = await User.findOne({ username: args.username });
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
};

export default resolvers;
