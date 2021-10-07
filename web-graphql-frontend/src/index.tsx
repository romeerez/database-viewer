import React from 'react';
import ReactDOM from 'react-dom';
import { DatabaseViewer } from 'frontend';
import { api } from './api';

ReactDOM.render(
  <React.StrictMode>
    <DatabaseViewer apiContext={api} />
  </React.StrictMode>,
  document.getElementById('root'),
);
