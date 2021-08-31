import React from 'react';
import {
  TableTree,
  Column as ColumnType,
} from '../../../components/DataTree/dataTree.service';
import TreeItem from '../../../components/DataTree/TreeItems/TreeItem';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import { TextColumnTwoLeft, Key } from '../../../icons';
import style from './style.module.css';

export default function Column({
  paddingLeft,
  table,
  column,
}: {
  paddingLeft: number;
  table?: TableTree;
  column: ColumnType;
}) {
  const { name, isNullable } = column;

  const isIndexed = table?.indices.some((index) =>
    index.columnNames.includes(name),
  );

  const isPrimary =
    isIndexed &&
    table?.indices.some(
      (index) => index.isPrimary && index.columnNames.includes(name),
    );

  const hasForeignKey = table?.foreignKeys.some((key) =>
    key.columnNames.includes(name),
  );

  return (
    <TreeItem
      key={name}
      paddingLeft={paddingLeft}
      buttonStyle={{ zIndex: 6 }}
      icon={() => (
        <div className="relative mr-2">
          {isIndexed && (
            <div
              className={`absolute left-0.5 top-2 w-1 h-2.5 bg-accent rounded ${style.indexedColumnIcon}`}
            />
          )}
          <TextColumnTwoLeft size={18} className="text-light-5" />
          {hasForeignKey && (
            <Key
              size={17}
              className={`absolute ${
                isPrimary ? '-right-1.5' : '-right-1'
              } bottom-0 text-accent`}
            />
          )}
          {isPrimary && (
            <Key
              size={17}
              className={`absolute ${
                hasForeignKey ? '-right-0.5' : '-right-1'
              } bottom-0 text-yellow-1`}
            />
          )}
        </div>
      )}
      title={
        <div className="flex-center">
          {name}
          <div className="text-sm ml-2 text-light-6">
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
