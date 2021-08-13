import React from 'react';
import ReactDOM from 'react-dom';
import { APIProvider } from './lib/api';
import { DatabaseViewer } from 'frontend';

ReactDOM.render(
  <React.StrictMode>
    <APIProvider component={DatabaseViewer} />
  </React.StrictMode>,
  document.getElementById('app'),
);
