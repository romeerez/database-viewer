import React from 'react';
import {
  TableTree,
  Column as ColumnType,
} from 'components/DataTree/dataTree.service';
import TreeItem from 'components/DataTree/TreeItems/TreeItem';
import MenuItem from 'components/Common/Menu/MenuItem';
import { TextColumnTwoLeft, Key } from 'icons';

export default function Column({
  paddingLeft,
  table,
  column,
}: {
  paddingLeft: number;
  table: TableTree;
  column: ColumnType;
}) {
  const { name, isNullable } = column;

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
            {!isPrimary && !isNullable && <span> not null</span>}
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
