import React from 'react';
import Header from '../../../components/Common/Header';
import { QueryInLocalStore } from '../types';
import { updateQuery } from '../query.service';
import history from '../../../lib/history';
import routes from '../../../lib/routes';

export default function QueryPageHeader({
  query,
}: {
  query: QueryInLocalStore;
}) {
  const { name } = query;

  return (
    <Header
      breadcrumbs={[
        'Queries',
        <label key={0} className="ml-1 flex items-center">
          <input
            className="w-full px-3 bg-dark-5 rounded h-7"
            value={name}
            onChange={(e) => {
              const name = e.target.value;
              updateQuery(query, { name });
              history.replace(routes.query(name));
            }}
          />
        </label>,
      ]}
    />
  );
}
