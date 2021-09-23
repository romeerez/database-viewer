import React from 'react';
import Theme from './components/Theme/Theme';
import Layout from './components/Layout';
import { Router as ReactRouter } from 'react-router-dom';
import history from './lib/history';
import { ToastContainer, Flip } from 'react-toastify';
import Router from './components/Router';
import { APIContext as APIContextType } from 'types';
import { APIContext } from './lib/apiContext';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
            theme="colored"
          />
        </ReactRouter>
      </APIContext.Provider>
    </React.StrictMode>
  );
};
