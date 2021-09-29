import React from 'react';
import { createOpenState } from '../open.state';
import TreeItem from '../../../components/DataTree/TreeItems/TreeItem';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import { Key } from '../../../icons';
import { ForeignKey as ForeignKeyType } from '../dataTree.types';

export default function ForeignKey({
  paddingLeft,
  foreignKey,
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
          <div className="ml-2 text-sm text-light-6">
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
