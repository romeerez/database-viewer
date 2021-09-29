import React from 'react';
import { createOpenState } from '../open.state';
import TreeItem from '../../../components/DataTree/TreeItems/TreeItem';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import { Key } from '../../../icons';
import { Constraint as ConstraintType } from '../dataTree.types';

export default function Constraint({
  paddingLeft,
  constraint,
}: {
  serverName: string;
  databaseName: string;
  schemaName: string;
  paddingLeft: number;
  constraint: ConstraintType;
  openState: ReturnType<typeof createOpenState>;
}) {
  const { name } = constraint;

  return (
    <TreeItem
      key={name}
      paddingLeft={paddingLeft}
      buttonStyle={{ zIndex: 6 }}
      icon={() => (
        <div className="relative flex-center mr-1.5">
          <Key size={20} className="text-yellow-1" />
        </div>
      )}
      title={
        <div className="flex-center">
          {name}
          <div className="text-sm ml-2 text-light-6">
            ({constraint.columnNames.join(', ')})
          </div>
        </div>
      }
      menu={() => (
        <>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </>
      )}
    />
  );
}
