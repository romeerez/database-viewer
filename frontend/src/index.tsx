import React from 'react';
import './index.css';
import Theme from './components/Theme/Theme';
import Layout from './components/Layout';
import { Router as ReactRouter } from 'react-router-dom';
import history from './lib/history';
import { ToastContainer, Flip } from 'react-toastify';
import Router from './components/Router';
import 'react-toastify/dist/ReactToastify.css';
import { APIContext as APIContextType } from 'types';
import { APIContext } from './lib/apiContext';

export const DatabaseViewer = ({
  apiContext,
}: {
  apiContext: APIContextType;
}) => {
  return (
    <React.StrictMode>
      <APIContext.Provider value={apiContext}>
        <ReactRouter history={history}>
          <Theme>
            <Layout>
              <Router />
            </Layout>
          </Theme>
          <ToastContainer
            position="bottom-right"
            transition={Flip}
            newestOnTop
          />
        </ReactRouter>
      </APIContext.Provider>
    </React.StrictMode>
  );
};
