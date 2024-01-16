import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
import { v1 as uuid } from 'uuid';
import mongoose from 'mongoose';
import * as logger from './utils/logger.js';
import { MONGODB_URI } from './utils/config.js';
import { Person } from './models/person.js';

mongoose.set('strictQuery', false);

logger.info('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
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
	findPerson(name: String!): Person
}

type Mutation {
  addPerson(
    name: String!
    phone: String
    city: String!
    street: String!
  ): Person
  editNumber(
    name: String!
    phone: String!
  ): Person
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
    addPerson: async (_, args) => {
      const person = new Person({ ...args });
      return person.save();
    },
    editNumber: async (_, args) => {
      const person = await Person.findOne({ name: args.name });
      person.phone = args.phone;
      return person.save();
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
  console.log(`server ready at ${url}`);
});
