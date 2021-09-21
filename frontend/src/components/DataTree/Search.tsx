import React from 'react';
import Input from '../../components/Common/Form/Input';
import { DataTreeState } from './dataTree.state';

export default function Search() {
  const value = DataTreeState.use('search');

  return (
    <Input
      placeholder="Search"
      className="bg-dark-3 text-light-5 px-2 w-full"
      value={value}
      onChange={(e) => DataTreeState.setSearch(e.target.value)}
    />
  );
}
