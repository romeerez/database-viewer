import React from 'react';
import Search from './Search';
import { Plus } from 'icons';
import { Link } from 'react-router-dom';
import routes from 'lib/routes';
import { queryStore } from 'components/Query/queryStore';
import { useObserver } from 'mobx-react-lite';
import Scrollbars from 'components/Common/Scrollbars';

export default function QueriesTree() {
  const queries = useObserver(() => queryStore.queries);

  return (
    <>
      <div className="p-4 flex items-center">
        <Search />
        <Link to={routes.newQuery} className="w-6 h-6 ml-2 flex-center">
          <Plus size={16} />
        </Link>
      </div>
      {queries && queries.length && (
        <Scrollbars>
          <div className="px-4">
            {queries.map((query) => (
              <div
                key={query.name}
                className="h-8 flex items-center rounded pl-2 duration-200 transition-all hover:bg-dark-2 hover:pl-4"
              >
                {query.name}
              </div>
            ))}
          </div>
        </Scrollbars>
      )}
    </>
  );
}
