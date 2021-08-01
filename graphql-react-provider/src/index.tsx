import React, { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { createClient } from './apolloClient';
import {
  useCheckConnectionMutation,
  useGetDataTreeLazyQuery,
  useQueryFieldsAndRowsLazyQuery,
  useQueryRowsLazyQuery,
} from './generated/graphql';
import { APIContext as APIContextType } from 'types';

export type {
  QueryFieldsAndRowsQuery,
  Field,
  GetDataTreeQuery,
  QueryResult,
} from './generated/graphql';

const contextValues = {
  useCheckConnectionMutation,
  useGetDataTreeLazyQuery,
  useQueryFieldsAndRowsLazyQuery,
  useQueryRowsLazyQuery,
};

export const APIProvider = ({
  uri,
  component: Component,
}: {
  uri: string;
  component: (props: { apiContext: APIContextType }) => JSX.Element;
}) => {
  const client = useMemo(() => createClient(uri), [uri]);

  return (
    <ApolloProvider client={client}>
      <Component apiContext={contextValues} />
    </ApolloProvider>
  );
};
