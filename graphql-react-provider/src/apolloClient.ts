import { ApolloClient, InMemoryCache } from '@apollo/client';

export const createClient = (uri: string) => new ApolloClient({
  uri,
  cache: new InMemoryCache({
    typePolicies: {
      DataSource: {
        keyFields: ['url'],
      },
    },
  }),
});