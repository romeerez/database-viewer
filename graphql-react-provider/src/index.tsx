import React, { useMemo } from 'react';
import { ApolloProvider, ApolloError, ServerError } from '@apollo/client';
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

type SimplifiedErrorOptions<T> = Omit<T, 'onError'> & {
  onError?(error: Error): void;
};

const simplifyError = <T extends { onError?(error: ApolloError): void }, R>(
  fn: (options: SimplifiedErrorOptions<T>) => R,
) => {
  return (options: SimplifiedErrorOptions<T>) => {
    return fn({
      ...options,
      onError(error: ApolloError) {
        options.onError?.(
          new Error(
            (error.networkError as ServerError)?.result.errors
              .map((error: Error) => error.message)
              .join('; ') || error.message,
          ),
        );
      },
    });
  };
};

const contextValues = {
  useCheckConnectionMutation,
  useGetDataTreeLazyQuery: simplifyError(useGetDataTreeLazyQuery),
  useQueryFieldsAndRowsLazyQuery: simplifyError(useQueryFieldsAndRowsLazyQuery),
  useQueryRowsLazyQuery: simplifyError(useQueryRowsLazyQuery),
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
