import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ApolloProvider } from '@apollo/client';
import { client } from 'lib/apolloClient';
import Theme from 'components/Theme/Theme';
import Layout from 'components/Layout';
import { Router } from 'react-router-dom';
import history from 'lib/history';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <ApolloProvider client={client}>
        <Theme>
          <Layout />
        </Theme>
        <ToastContainer position="bottom-right" transition={Flip} newestOnTop />
      </ApolloProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
