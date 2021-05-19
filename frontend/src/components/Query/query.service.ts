import { QueryInLocalStore } from 'components/Query/types';
import { useState } from 'react';
import { queryStore } from 'components/Query/queryStore';
import { toast } from 'react-toastify';

export const useSaveQuery = () => {
  const [loading, setLoading] = useState(false);

  const save = async (
    query: Pick<QueryInLocalStore, 'name' | 'content' | 'databaseUrl'> & {
      id?: QueryInLocalStore['id'];
    },
  ) => {
    setLoading(true);

    const record = await queryStore.create(query);

    toast('Query created', { type: 'info' });
    setLoading(false);
    return record;
  };

  return { loading, save };
};
