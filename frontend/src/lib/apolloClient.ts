import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL,
  cache: new InMemoryCache({
    typePolicies: {
      DataSource: {
        keyFields: ['url'],
      },
    },
  }),
});

// eslint-disable-next-line
(window as any).apolloClient = client
