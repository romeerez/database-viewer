import React, { useState } from 'react';
import Search from './Search';
import { Plus } from '../../../icons';
import Scrollbars from '../../../components/Common/Scrollbars';
import {
  deleteQuery,
  useCreateQuery,
} from '../../../components/Query/query.service';
import { useFilteredQueries } from '../../../components/Query/QueriesTree/queriesTree.service';
import QueryTreeItem from '../../../components/Query/QueriesTree/QueryTreeItem';
import ConfirmModal from '../../../components/Common/Modals/ConfirmModal';
import { QueryInLocalStore } from '../../../components/Query/types';

export default function QueriesTree() {
  const queries = useFilteredQueries();
  const { createQuery } = useCreateQuery();

  const [queryToDelete, setQueryToDelete] = useState<
    QueryInLocalStore | undefined
  >();

  const [deleting, setDeleting] = useState(false);

  const onDelete = async (close: () => void) => {
    setDeleting(true);
    const query = queryToDelete as QueryInLocalStore;
    await deleteQuery(query);
    close();
    setDeleting(false);
  };

  return (
    <>
      <ConfirmModal
        open={Boolean(queryToDelete)}
        onClose={() => setQueryToDelete(undefined)}
        onConfirm={onDelete}
        text={
          !queryToDelete ? null : (
            <>
              Are you sure to delete{' '}
              <span className="text-accent">{queryToDelete.name}</span> data
              source?
            </>
          )
        }
        loading={deleting}
      />
      <div className="p-4 flex items-center">
        <Search />
        <button onClick={createQuery} className="w-6 h-6 ml-2 flex-center">
          <Plus size={16} />
        </button>
      </div>
      {queries && queries.length > 0 && (
        <Scrollbars>
          <div className="px-4">
            {queries.map((query) => (
              <QueryTreeItem
                key={query.id}
                query={query}
                setQueryToDelete={setQueryToDelete}
              />
            ))}
          </div>
        </Scrollbars>
      )}
    </>
  );
}
