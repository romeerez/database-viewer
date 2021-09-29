import React from 'react';
import TreeItem from '../../DataTree/TreeItems/TreeItem';
import MenuItem from '../../Common/Menu/MenuItem';
import ColumnIcon from '../../Column/ColumnIcon';
import {
  columnHasForeignKey,
  isColumnIndexed,
  isColumnPrimary,
} from '../../Column/column.utils';
import ColumnTitle from '../../Column/ColumnTitle';
import { Column as ColumnType, TableTree } from '../dataTree.types';

export default function Column({
  paddingLeft,
  table,
  column,
}: {
  paddingLeft: number;
  table?: TableTree;
  column: ColumnType;
}) {
  const { name } = column;

  const isIndexed = table ? isColumnIndexed(table, name) : false;
  const isPrimary = table ? isColumnPrimary(table, name, isIndexed) : false;
  const hasForeignKey = table ? columnHasForeignKey(table, name) : false;

  return (
    <TreeItem
      key={name}
      paddingLeft={paddingLeft}
      buttonStyle={{ zIndex: 6 }}
      icon={() => (
        <ColumnIcon
          className="mr-2"
          isIndexed={isIndexed}
          isPrimary={isPrimary}
          hasForeignKey={hasForeignKey}
        />
      )}
      title={<ColumnTitle column={column} isPrimary={isPrimary} />}
      menu={() => (
        <>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </>
      )}
    />
  );
}
