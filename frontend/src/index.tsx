import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Theme from 'components/Theme/Theme';
import Layout from 'components/Layout';
import { Router as ReactRouter } from 'react-router-dom';
import history from 'lib/history';
import { ToastContainer, Flip } from 'react-toastify';
import Router from 'components/Router';
import { APIProvider } from 'graphql-react-provider';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <React.StrictMode>
    <ReactRouter history={history}>
      <APIProvider uri={import.meta.env.VITE_GRAPHQL_URL as string}>
        <Theme>
          <Layout>
            <Router />
          </Layout>
        </Theme>
        <ToastContainer position="bottom-right" transition={Flip} newestOnTop />
      </APIProvider>
    </ReactRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
