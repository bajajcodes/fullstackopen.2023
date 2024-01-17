import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
import { v1 as uuid } from 'uuid';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import * as logger from './utils/logger.js';
import * as config from './utils/config.js';
import { Person } from './models/person.js';
import { User } from './models/user.js';

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

const typeDefs = `

enum YesNo {
  YES
  NO
}

type User {
username: String!
friends: [Person!]!
id: ID!
}

type Token {
  value: String!
}

type Address {
  street: String!
  city: String! 
}

	type Person {
		name: String!
		phone: String
    address: Address!
		id: ID!
}

	type Query  {
	personCount: Int!
	allPersons(phone: YesNo): [Person!]!
  allUsers:[User!]!
	findPerson(name: String!): Person
  me: User
}

type Mutation {
  addPerson(
    name: String!
    phone: String
    city: String!
    street: String!
  ): Person
  addAsFriend(name: String!): User
  editNumber(
    name: String!
    phone: String!
  ): Person
  createUser(username: String!): User
  login(username: String!, password: String!): Token
}

`;

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id).populate(
        'friends'
      );
      return {
        currentUser,
      };
    }
  },
}).then(({ url }) => {
  console.log(`server ready at ${url}`);
});
