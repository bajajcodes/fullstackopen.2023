import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import typeDefs from './schema.js';
import resolvers from './resolvers.js';
import { User } from './models/user.js';
import * as config from './utils/config.js';
import * as logger from './utils/logger.js';

mongoose.set('strictQuery', false);
mongoose.set('debug', true);

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req.headers?.authorization || null;
    const hasToken = auth?.startsWith?.('Bearer ');
    if (!hasToken) return;
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
