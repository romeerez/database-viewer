import { QueryInLocalStore } from '../../components/Query/types';
import { useState } from 'react';
import { queriesStore } from '../../components/Query/queries.store';
import { toast } from 'react-toastify';
import { useObserver } from 'mobx-react-lite';
import history from '../../lib/history';
import routes from '../../lib/routes';
import { queriesDb } from '../../lib/db';

export const useQueries = () => useObserver(() => queriesStore.queries);

export const useCreateQuery = () => {
  const queries = useObserver(() => queriesStore.queries);
  const [loading, setLoading] = useState(false);

  const createQuery = async () => {
    if (!queries) return;

    setLoading(true);
    const names = queries.map((query) => query.name) || [];
    let name = 'New query';
    let num = 0;
    while (names.includes(name)) {
      num++;
      name = `New query ${num}`;
    }

    try {
      await queriesStore.create({ name, content: '' });
      history.push(routes.query(name));
    } catch (err) {
      toast(err.message, { type: 'error' });
    }

    setLoading(false);
  };

  return { createQuery, loading };
};

export const updateQuery = (
  query: QueryInLocalStore,
  data: Partial<QueryInLocalStore>,
) => queriesStore.update(query, data);

export const deleteQuery = async (query: QueryInLocalStore) => {
  if (history.location.pathname === routes.query(query.name)) {
    history.push(routes.root);
  }
  await queriesStore.delete(query);
};
