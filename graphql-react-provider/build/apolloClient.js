import { ApolloClient, InMemoryCache } from '@apollo/client';
export var createClient = function (uri) { return new ApolloClient({
    uri: uri,
    cache: new InMemoryCache({
        typePolicies: {
            DataSource: {
                keyFields: ['url'],
            },
        },
    }),
}); };
