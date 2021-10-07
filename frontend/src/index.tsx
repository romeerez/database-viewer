import React from 'react';
import Theme from './components/Theme/Theme';
import Layout from './components/Layout';
import { Router as ReactRouter } from 'react-router-dom';
import history from './lib/history';
import { ToastContainer, Flip } from 'react-toastify';
import Router from './components/Router';
import { ApiContext as ApiContextType } from 'types';
import { APIContext } from './lib/apiContext';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { QueryClient, QueryClientProvider } from 'react-query';
import OverlayContent from './components/Common/OverlayContent/OverlayContent';

dayjs.extend(utc);

const queryClient = new QueryClient();

export const DatabaseViewer = ({
  apiContext,
}: {
  apiContext: ApiContextType;
}) => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
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
            <OverlayContent />
          </ReactRouter>
        </APIContext.Provider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};
