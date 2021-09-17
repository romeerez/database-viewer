import React from 'react';
import { Column as ColumnType } from '../DataTree/dataTree.service';

export default function ColumnTitle({
  column,
  isPrimary,
}: {
  column: ColumnType;
  isPrimary: boolean;
}) {
  const def = column.default?.startsWith('nextval')
    ? ' autoincrement'
    : column.default
    ? ` = ${column.default}`
    : '';

  return (
    <div className="flex-center whitespace-nowrap">
      {column.name}
      <div className="text-sm ml-2 text-light-6">
        {column.type}
        {!isPrimary && !column.isNullable && <span> not null</span>}
        {def}
      </div>
    </div>
  );
}
