import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import * as config from './utils/config.js';
import { Person } from './models/person.js';
import { User } from './models/user.js';

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (_, args) => {
      if (!args.phone) return Person.find({});
      return Person.find({ phone: { $exists: args.phone === 'YES' } });
    },
    findPerson: async (_, { name }) => Person.findOne({ name }),
    allUsers: async () => {
      return User.find({});
    },
    me: async (root, args, context) => {
      return context.currentUser;
    },
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
  Mutation: {
    addPerson: async (root, args, context) => {
      const person = new Person({ ...args });
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      try {
        await person.save();
        currentUser.friends = currentUser.friends.concat(person);
        await currentUser.save();
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        });
      }

      return person;
    },
    addAsFriend: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      const isFriend = (person) =>
        currentUser.friends
          .map((f) => f._id.toString())
          .includes(person._id.toString());

      const person = await Person.findOne({ name: args.name });
      if (!isFriend(person)) {
        currentUser.friends = currentUser.friends.concat(person);
      }
      await currentUser.save();

      return currentUser;
    },
    editNumber: async (_, args) => {
      const person = await Person.findOne({ name: args.name });
      person.phone = args.phone;
      try {
        return await person.save();
      } catch (error) {
        throw new GraphQLError('Saving number failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.phone,
            error,
          },
        });
      }
    },
    createUser: async (_, args) => {
      const user = new User({ username: args.username });
      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };
      const token = jwt.sign(userForToken, config.JWT_SECRET);

      return { value: token };
    },
  },
};

export default resolvers;
