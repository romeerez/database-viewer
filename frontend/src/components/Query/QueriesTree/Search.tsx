import React from 'react';
import Input from 'components/Common/Form/Input';
import { DataTreeState } from 'components/DataTree/dataTree.state';
import { useObserver } from 'mobx-react-lite';

export default function Search() {
  const value = useObserver(() => DataTreeState.search);

  return (
    <Input
      placeholder="Search"
      className="bg-lighter text-light-5 px-2 w-full"
      value={value}
      onChange={(e) => DataTreeState.setSearch(e.target.value)}
    />
  );
}
