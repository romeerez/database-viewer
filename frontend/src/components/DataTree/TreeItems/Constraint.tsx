import React from 'react';
import { Constraint as ConstraintType } from '../../../components/DataTree/dataTree.service';
import { createOpenState } from '../../../components/DataTree/open.state';
import TreeItem from '../../../components/DataTree/TreeItems/TreeItem';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import { Key } from '../../../icons';
import { PathState } from '../../../components/DataTree/path.state';
import routes from '../../../lib/routes';

export default function Constraint({
  sourceName,
  databaseName,
  schemaName,
  paddingLeft,
  constraint,
  openState,
}: {
  sourceName: string;
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
