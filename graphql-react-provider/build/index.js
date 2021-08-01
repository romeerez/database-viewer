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
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { createClient } from './apolloClient';
import { useCheckConnectionMutation, useGetDataTreeLazyQuery, useQueryFieldsAndRowsLazyQuery, useQueryRowsLazyQuery, } from './generated/graphql';
var contextValues = {
    useCheckConnectionMutation: useCheckConnectionMutation,
    useGetDataTreeLazyQuery: useGetDataTreeLazyQuery,
    useQueryFieldsAndRowsLazyQuery: useQueryFieldsAndRowsLazyQuery,
    useQueryRowsLazyQuery: useQueryRowsLazyQuery,
};
export var APIContext = createContext(contextValues);
export var useAPIContext = function () {
    return useContext(APIContext);
};
export var APIProvider = function (_a) {
    var uri = _a.uri, children = _a.children;
    var client = useMemo(function () { return createClient(uri); }, [uri]);
    return _jsx(ApolloProvider, __assign({ client: client }, { children: _jsx(APIContext.Provider, __assign({ value: contextValues }, { children: children }), void 0) }), void 0);
};
