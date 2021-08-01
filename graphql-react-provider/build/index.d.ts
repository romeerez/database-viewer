import React, { ReactNode } from 'react';
import { useCheckConnectionMutation, useGetDataTreeLazyQuery, useQueryFieldsAndRowsLazyQuery, useQueryRowsLazyQuery } from './generated/graphql';
export type { QueryFieldsAndRowsQuery, Field, GetDataTreeQuery, QueryResult } from './generated/graphql';
export declare const APIContext: React.Context<{
    useCheckConnectionMutation: typeof useCheckConnectionMutation;
    useGetDataTreeLazyQuery: typeof useGetDataTreeLazyQuery;
    useQueryFieldsAndRowsLazyQuery: typeof useQueryFieldsAndRowsLazyQuery;
    useQueryRowsLazyQuery: typeof useQueryRowsLazyQuery;
}>;
export declare const useAPIContext: () => {
    useCheckConnectionMutation: typeof useCheckConnectionMutation;
    useGetDataTreeLazyQuery: typeof useGetDataTreeLazyQuery;
    useQueryFieldsAndRowsLazyQuery: typeof useQueryFieldsAndRowsLazyQuery;
    useQueryRowsLazyQuery: typeof useQueryRowsLazyQuery;
};
export declare const APIProvider: ({ uri, children }: {
    uri: string;
    children?: ReactNode;
}) => JSX.Element;
