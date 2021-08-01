import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from '../lib/routes';
import HomePage from '../components/HomePage';
import TablePage from '../components/Table/TablePage';
import QueryPage from '../components/Query/QueryPage/QueryPage';

export default function Router() {
  return (
    <Switch>
      <Route exact path={routes.root} component={HomePage} />
      <Route exact path={routes.table()} component={TablePage} />
      <Route exact path={routes.query()} component={QueryPage} />
      <Redirect to={routes.root} />
    </Switch>
  );
}
