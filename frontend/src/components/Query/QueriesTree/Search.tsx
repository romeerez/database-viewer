import React from 'react';
import Input from 'components/Common/Form/Input';
import { useSearch } from 'components/Query/QueriesTree/queriesTree.service';

export default function Search() {
  const [search, setSearch] = useSearch();

  return (
    <Input
      placeholder="Search"
      className="bg-lighter text-light-5 px-2 w-full"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
