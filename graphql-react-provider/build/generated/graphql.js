var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
var defaultOptions = {};
export var ConstraintType;
(function (ConstraintType) {
    ConstraintType["PrimaryKey"] = "PRIMARY_KEY";
    ConstraintType["Unique"] = "UNIQUE";
    ConstraintType["Check"] = "CHECK";
    ConstraintType["Exclude"] = "EXCLUDE";
})(ConstraintType || (ConstraintType = {}));
export var CheckConnectionDocument = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    mutation CheckConnection($url: String!) {\n  checkConnection(url: $url)\n}\n    "], ["\n    mutation CheckConnection($url: String!) {\n  checkConnection(url: $url)\n}\n    "])));
/**
 * __useCheckConnectionMutation__
 *
 * To run a mutation, you first call `useCheckConnectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckConnectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkConnectionMutation, { data, loading, error }] = useCheckConnectionMutation({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useCheckConnectionMutation(baseOptions) {
    var options = __assign(__assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(CheckConnectionDocument, options);
}
export var GetDataTreeDocument = gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    query GetDataTree($urls: [String!]!) {\n  dataSources(urls: $urls) {\n    url\n    types {\n      id\n      name\n      schemaName\n    }\n    databases {\n      name\n      schemas {\n        name\n        types {\n          id\n          name\n          schemaName\n        }\n        tables {\n          name\n          columns {\n            name\n            type\n            default\n            isNullable\n          }\n          indices {\n            columnNames\n            name\n            isUnique\n            isPrimary\n          }\n          foreignKeys {\n            foreignTableSchemaName\n            foreignTableName\n            name\n            columnNames\n            foreignColumnNames\n          }\n          constraints {\n            schemaName\n            tableName\n            name\n            type\n            columnNames\n          }\n        }\n      }\n    }\n  }\n}\n    "], ["\n    query GetDataTree($urls: [String!]!) {\n  dataSources(urls: $urls) {\n    url\n    types {\n      id\n      name\n      schemaName\n    }\n    databases {\n      name\n      schemas {\n        name\n        types {\n          id\n          name\n          schemaName\n        }\n        tables {\n          name\n          columns {\n            name\n            type\n            default\n            isNullable\n          }\n          indices {\n            columnNames\n            name\n            isUnique\n            isPrimary\n          }\n          foreignKeys {\n            foreignTableSchemaName\n            foreignTableName\n            name\n            columnNames\n            foreignColumnNames\n          }\n          constraints {\n            schemaName\n            tableName\n            name\n            type\n            columnNames\n          }\n        }\n      }\n    }\n  }\n}\n    "])));
/**
 * __useGetDataTreeQuery__
 *
 * To run a query within a React component, call `useGetDataTreeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDataTreeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDataTreeQuery({
 *   variables: {
 *      urls: // value for 'urls'
 *   },
 * });
 */
export function useGetDataTreeQuery(baseOptions) {
    var options = __assign(__assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(GetDataTreeDocument, options);
}
export function useGetDataTreeLazyQuery(baseOptions) {
    var options = __assign(__assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(GetDataTreeDocument, options);
}
export var QueryFieldsAndRowsDocument = gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    query QueryFieldsAndRows($url: String!, $query: String!) {\n  executeQuery(url: $url, query: $query) {\n    fields {\n      name\n      type\n    }\n    rows\n  }\n}\n    "], ["\n    query QueryFieldsAndRows($url: String!, $query: String!) {\n  executeQuery(url: $url, query: $query) {\n    fields {\n      name\n      type\n    }\n    rows\n  }\n}\n    "])));
/**
 * __useQueryFieldsAndRowsQuery__
 *
 * To run a query within a React component, call `useQueryFieldsAndRowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryFieldsAndRowsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryFieldsAndRowsQuery({
 *   variables: {
 *      url: // value for 'url'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useQueryFieldsAndRowsQuery(baseOptions) {
    var options = __assign(__assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(QueryFieldsAndRowsDocument, options);
}
export function useQueryFieldsAndRowsLazyQuery(baseOptions) {
    var options = __assign(__assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(QueryFieldsAndRowsDocument, options);
}
export var QueryRowsDocument = gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    query QueryRows($url: String!, $query: String!) {\n  executeQuery(url: $url, query: $query) {\n    rows\n  }\n}\n    "], ["\n    query QueryRows($url: String!, $query: String!) {\n  executeQuery(url: $url, query: $query) {\n    rows\n  }\n}\n    "])));
/**
 * __useQueryRowsQuery__
 *
 * To run a query within a React component, call `useQueryRowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryRowsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryRowsQuery({
 *   variables: {
 *      url: // value for 'url'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useQueryRowsQuery(baseOptions) {
    var options = __assign(__assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(QueryRowsDocument, options);
}
export function useQueryRowsLazyQuery(baseOptions) {
    var options = __assign(__assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(QueryRowsDocument, options);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
