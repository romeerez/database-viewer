import React from 'react';
import Search from './Search';
import { Plus } from 'icons';
import { Link } from 'react-router-dom';
import routes from 'lib/routes';

export default function QueriesTree() {
  return (
    <>
      <div className="p-4 flex items-center">
        <Search />
        <Link to={routes.newQuery} className="w-6 h-6 ml-2 flex-center">
          <Plus size={16} />
        </Link>
      </div>
    </>
  );
}
