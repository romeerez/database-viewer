import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { createClient } from './apolloClient';
import {
  useCheckConnectionMutation,
  useGetDataTreeLazyQuery,
  useQueryFieldsAndRowsLazyQuery,
  useQueryRowsLazyQuery,
} from './generated/graphql';

export type {
  QueryFieldsAndRowsQuery,
  Field,
  GetDataTreeQuery,
  QueryResult
} from './generated/graphql'

const contextValues = {
  useCheckConnectionMutation,
  useGetDataTreeLazyQuery,
  useQueryFieldsAndRowsLazyQuery,
  useQueryRowsLazyQuery,
}

export const APIContext = createContext(contextValues);

export const useAPIContext = () =>
  useContext(APIContext)

export const APIProvider = ({ uri, children }: { uri: string, children?: ReactNode }) => {
  const client = useMemo(() => createClient(uri), [uri])

  return <ApolloProvider client={client}>
    <APIContext.Provider value={contextValues}>
      {children}
    </APIContext.Provider>
  </ApolloProvider>
}
