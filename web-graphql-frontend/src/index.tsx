import React from 'react';
import ReactDOM from 'react-dom';
import { APIProvider } from 'graphql-react-provider';
import { DatabaseViewer } from 'frontend';

ReactDOM.render(
  <React.StrictMode>
    <APIProvider
      uri={import.meta.env.VITE_GRAPHQL_URL as string}
      component={DatabaseViewer}
    />
  </React.StrictMode>,
  document.getElementById('root'),
);
