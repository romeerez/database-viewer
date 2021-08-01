import React from 'react';
import { ForeignKey as ForeignKeyType } from '../../../components/DataTree/dataTree.service';
import { createOpenState } from '../../../components/DataTree/open.state';
import TreeItem from '../../../components/DataTree/TreeItems/TreeItem';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import { Key } from '../../../icons';
import { PathState } from '../../../components/DataTree/path.state';
import routes from '../../../lib/routes';

export default function ForeignKey({
  sourceName,
  databaseName,
  schemaName,
  paddingLeft,
  foreignKey,
  openState,
}: {
  sourceName: string;
  databaseName: string;
  schemaName: string;
  paddingLeft: number;
  foreignKey: ForeignKeyType;
  openState: ReturnType<typeof createOpenState>;
}) {
  const { name } = foreignKey;

  return (
    <TreeItem
      key={name}
      paddingLeft={paddingLeft}
      buttonStyle={{ zIndex: 6 }}
      icon={() => (
        <div className="relative flex-center mr-1.5">
          <Key size={20} className="text-accent" />
        </div>
      )}
      title={
        <div className="flex-center">
          {name}
          <div className="ml-2 text-sm text-light-4">
            ({foreignKey.columnNames.join(', ')}) →{' '}
            {foreignKey.foreignTableName} (
            {foreignKey.foreignColumnNames.join(', ')})
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
