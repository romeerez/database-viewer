import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomePage from 'components/HomePage';
import TablePage from 'components/Table/TablePage';
import routes from 'lib/routes';

export default function Router() {
  return (
    <Switch>
      <Route exact path={routes.root} component={HomePage} />
      <Route exact path={routes.table()} component={TablePage} />
      <Redirect to={routes.root} />
    </Switch>
  );
}
