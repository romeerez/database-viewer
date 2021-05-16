import React from 'react';
import {
  TableTree,
  Column as ColumnType,
} from 'components/DataTree/dataTree.service';
import { createOpenState } from 'components/DataTree/open.state';
import TreeItem from 'components/DataTree/TreeItems/TreeItem';
import MenuItem from 'components/Common/Menu/MenuItem';
import { TextColumnTwoLeft, Key } from 'icons';
import { PathState } from 'components/DataTree/path.state';
import routes from 'lib/routes';

export default function Column({
  sourceName,
  databaseName,
  schemaName,
  paddingLeft,
  table,
  column,
  openState,
}: {
  sourceName: string;
  databaseName: string;
  schemaName: string;
  paddingLeft: number;
  table: TableTree;
  column: ColumnType;
  openState: ReturnType<typeof createOpenState>;
}) {
  const { name } = column;

  const isPrimary = table.indices.some(
    (index) => index.isPrimary && index.columnNames.includes(name),
  );

  const hasForeignKey =
    !isPrimary &&
    table.foreignKeys.some((key) => key.columnNames.includes(name));

  return (
    <TreeItem
      key={name}
      paddingLeft={paddingLeft}
      buttonStyle={{ zIndex: 6 }}
      icon={() => (
        <div className="relative mr-2">
          <TextColumnTwoLeft size={18} className="text-light-5" />
          {isPrimary && (
            <Key size={17} className="absolute -right-1 bottom-0 text-yellow" />
          )}
          {hasForeignKey && (
            <Key size={17} className="absolute -right-1 bottom-0 text-accent" />
          )}
        </div>
      )}
      title={
        <div className="flex-center">
          {name}
          <div className="text-sm ml-2 text-light-4">
            {column.type}
            {column.default && <span> = {column.default}</span>}
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
