import React from 'react';
import Input from 'components/Common/Form/Input';
import { SearchState } from 'components/DataTree/search.state';
import { useObserver } from 'mobx-react-lite';

export default function Search() {
  const value = useObserver(() => SearchState.search);

  return (
    <Input
      placeholder="Search"
      className="bg-lighter text-light-5 px-2 w-full"
      value={value}
      onChange={(e) => SearchState.setSearch(e.target.value)}
    />
  );
}
