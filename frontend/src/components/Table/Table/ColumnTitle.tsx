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
import { Sort, SortUp, SortDown } from '../../../icons';

export default function ColumnTitle({
  table,
  field,
  index,
}: {
  table: TableTree;
  field: FieldInfo;
  index: number;
}) {
  const {
    selectionService,
    tableService,
    tableDataService,
    conditionsService,
  } = useTablePageContext();
  const isSelected = selectionService.useIsColumnSelected(index);

  const { name } = field;
  const isIndexed = isColumnIndexed(table, name);
  const isPrimary = isColumnPrimary(table, name, isIndexed);
  const hasForeignKey = columnHasForeignKey(table, name);
  const orderByMap = tableDataService.use('orderByMap');
  const order = orderByMap[name];

  const sort = () => {
    let value: string;
    if (Object.keys(orderByMap).length === 1 && order?.pos === 0) {
      if (order.dir === 'asc') {
        value = `${name} DESC`;
      } else {
        value = '';
      }
    } else {
      value = `${name} ASC`;
    }
    tableDataService.setOrderBy(value);
    conditionsService.updateValue('orderBy', () => value);
  };

  return (
    <th
      key={name}
      tabIndex={-1}
      {...tableService.getColumnProps(index)}
      className="h-10 border-b border-l border-dark-4 bg-dark-3 sticky z-10 top-0"
    >
      <Tooltip text={<ColumnInfo column={field} isPrimary={isPrimary} />}>
        <button
          type="button"
          className={cn(
            'min-w-full min-h-full flex items-center space-between max-w-sm truncate pl-4 pr-2',
            isSelected && 'bg-lighter-4',
          )}
          onClick={sort}
        >
          <div className="flex items-center">
            <ColumnIcon
              className="mr-2"
              isIndexed={isIndexed}
              isPrimary={isPrimary}
              hasForeignKey={hasForeignKey}
            />
            {name}
          </div>
          <div className="ml-2 opacity-50">
            {!order && <Sort size={14} />}
            {order?.dir === 'asc' && <SortUp size={14} />}
            {order?.dir === 'desc' && <SortDown size={14} />}
            {order && <span className="ml-1">{order.pos + 1}</span>}
          </div>
        </button>
      </Tooltip>
    </th>
  );
}
