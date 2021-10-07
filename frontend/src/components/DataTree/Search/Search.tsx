import React from 'react';
import Input from '../../Common/Form/Input';
import { useDataTreeContext } from '../dataTree.context';

export default function Search() {
  const { searchService } = useDataTreeContext();
  const value = searchService.useSearch();

  return (
    <Input
      placeholder="Search"
      className="bg-dark-3 text-light-5 px-2 w-full"
      value={value}
      onChange={(e) => searchService.setSearch(e.target.value)}
    />
  );
}
