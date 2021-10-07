import React from 'react';
import TreeItem from '../TreeItems/TreeItem';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import { Info } from '../../../icons';
import { Index as IndexType } from '../dataTree.types';

export default function Index({
  paddingLeft,
  index,
}: {
  paddingLeft: number;
  index: IndexType;
}) {
  const { name } = index;

  return (
    <TreeItem
      key={name}
      paddingLeft={paddingLeft}
      buttonStyle={{ zIndex: 6 }}
      icon={() => (
        <div className="relative flex-center mr-2.5">
          <Info size={16} className="text-accent" />
          {index.isUnique && (
            <sub className="absolute text-xs text-light-4 font-bold -right-1 -bottom-1.5 mr-px">
              U
            </sub>
          )}
        </div>
      )}
      name={name}
      title={(name) => (
        <div className="flex-center">
          {name}
          <div className="text-sm ml-2 text-light-6">
            ({index.columnNames.join(', ')})
            {index.isUnique && <span className="ml-2">UNIQUE</span>}
          </div>
        </div>
      )}
      menu={() => (
        <>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </>
      )}
    />
  );
}
