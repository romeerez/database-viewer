import React from 'react';
import { useTablePageContext } from '../TablePage.context';
import { FieldInfo } from '../TableData/tableData.store';
import cn from 'classnames';
import { TableTree } from '../../DataTree/dataTree.service';
import {
  columnHasForeignKey,
  isColumnIndexed,
  isColumnPrimary,
} from '../../Column/column.utils';
import ColumnIcon from '../../Column/ColumnIcon';
import ColumnInfo from '../../Column/ColumnTitle';
import Tooltip from '../../Common/Tooltip/Tooltip';

export default function ColumnTitle({
  table,
  field,
  index,
}: {
  table: TableTree;
  field: FieldInfo;
  index: number;
}) {
  const { selectionService, tableService } = useTablePageContext();
  const isSelected = selectionService.useIsColumnSelected(index);

  const name = field.name;
  const isIndexed = isColumnIndexed(table, name);
  const isPrimary = isColumnPrimary(table, name, isIndexed);
  const hasForeignKey = columnHasForeignKey(table, name);

  return (
    <th
      key={name}
      tabIndex={-1}
      {...tableService.getColumnProps(index)}
      className="h-10 border-b border-l border-dark-4 bg-dark-3 sticky z-10 top-0"
    >
      <Tooltip text={<ColumnInfo column={field} isPrimary={isPrimary} />}>
        <div
          className={cn(
            'min-w-full min-h-full flex items-center max-w-sm truncate px-4 pointer-events-none',
            isSelected && 'bg-lighter-4',
          )}
        >
          <ColumnIcon
            className="mr-2"
            isIndexed={isIndexed}
            isPrimary={isPrimary}
            hasForeignKey={hasForeignKey}
          />
          {name}
        </div>
      </Tooltip>
    </th>
  );
}
