import {
  ApiContext,
  CheckConnectionDocument,
  GetDataTreeDocument,
  QueryFieldsAndRowsDocument,
  QueryRowsDocument,
} from 'types';

export const api: ApiContext = {
  checkConnection(params) {
    return gqlRequest(CheckConnectionDocument, params);
  },
  getServerTree(params) {
    return gqlRequest(GetDataTreeDocument, params);
  },
  fieldsAndRows(params) {
    return gqlRequest(QueryFieldsAndRowsDocument, params);
  },
  rows(params) {
    return gqlRequest(QueryRowsDocument, params);
  },
};

const gqlRequest = async (query: unknown, variables: unknown) => {
  const request = await fetch(import.meta.env.VITE_GRAPHQL_URL as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await request.json();

  if (json.errors) {
    const { message } = json.errors[0];

    throw new Error(message);
  }

  return json.data;
};
