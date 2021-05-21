import React from 'react';
import { QueryInLocalStore } from 'components/Query/types';
import { useObserver } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import routes from 'lib/routes';
import { X } from 'icons';

export default function QueryTreeItem({
  query,
  setQueryToDelete,
}: {
  query: QueryInLocalStore;
  setQueryToDelete(query: QueryInLocalStore): void;
}) {
  const name = useObserver(() => query.name);

  return (
    <NavLink
      to={routes.query(name)}
      className="h-8 mb-1 flex items-center justify-between rounded pl-2 duration-200 transition-all hover:bg-dark-2 hover:pl-4 group"
      activeClassName="bg-accent-dark hover:bg-accent-dark"
    >
      {name}
      <button
        className="flex-center p-2 opacity-0 group-hover:opacity-100 hover:bg-darker-5"
        onClick={(e) => {
          e.preventDefault();
          setQueryToDelete(query);
        }}
      >
        <X size={18} />
      </button>
    </NavLink>
  );
}
