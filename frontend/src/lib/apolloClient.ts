import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL as string,
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
