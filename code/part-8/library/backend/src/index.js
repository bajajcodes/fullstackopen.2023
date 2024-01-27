import { ApolloServer } from '@apollo/server';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import cors from 'cors';
import http from 'http';
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

const start = async () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  });
  const serverCleanup = useServer({ schema }, wsServer);

  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              return await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    '/',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req?.headers?.authorization;
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET);
          const currentUser = await User.findById(decodedToken.id);
          return { currentUser };
        }
      },
    })
  );

  httpServer.listen(config.PORT, () => {
    console.log(`Server is now running on http://localhost:${config.PORT}`);
  });
};

start();
