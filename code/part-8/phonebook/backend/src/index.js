import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
import { v1 as uuid } from 'uuid';
import mongoose from 'mongoose';
import * as logger from './utils/logger.js';
import { MONGODB_URI } from './utils/config.js';

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

const persons = [
  {
    name: 'Arto Hellas',
    phone: '040-123543',
    street: 'Tapiolankatu 5 A',
    city: 'Espoo',
    id: '3d594650-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Matti Luukkainen',
    phone: '040-432342',
    street: 'Malminkaari 10 A',
    city: 'Helsinki',
    id: '3d599470-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Venla Ruuska',
    street: 'Nallemäentie 22 C',
    city: 'Helsinki',
    id: '3d599471-3436-11e9-bc57-8b80ba54c431',
  },
];

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
    personCount: () => persons.length,
    allPersons: (_, args) => {
      if (!args.phone) return persons;
      return persons.filter((p) => (args.phone === 'YES' ? p.phone : !p.phone));
    },
    findPerson: (root, args) =>
      persons.find((p) => p.name === args.name) || null,
  },
  Person: {
    name: (root) => root.name,
    id: (root) => root.id,
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
  Mutation: {
    addPerson: (_, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new GraphQLError('Name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        });
      }
      const person = { ...args, id: uuid() };
      persons.push(person);
      return person;
    },
    editNumber: (_, args) => {
      const index = persons.findIndex((p) => p.name === args.name);
      if (index < 0) {
        return null;
      }
      const person = persons[index];
      const updatedPerson = { ...person, phone: args.phone };
      persons.splice(index, 1, updatedPerson);
      return updatedPerson;
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
