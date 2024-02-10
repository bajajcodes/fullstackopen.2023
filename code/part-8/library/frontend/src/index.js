import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';
import { getToken } from './utils/local-storage';
import App from './App';
import { AuthContextProvider } from './context/auth-context-provider';

//TODO
/**
 * 8.22 Up-to-date cache and book recommendations
If you did the previous exercise, that is, fetch the books in a genre with GraphQL, ensure somehow that the books view is kept up to date. So when a new book is added, the books view is updated at least when a genre selection button is pressed.

When new genre selection is not done, the view does not have to be updated
 */

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  console.log({ token });
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
});

const wsLink = new GraphQLWsLink(createClient({ url: 'ws://localhost:4000' }));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </ApolloProvider>
);
