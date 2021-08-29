import React from 'react';
import { FieldInfo } from '../TableData/tableData.store';
import { observer } from 'mobx-react-lite';
import cn from 'classnames';
import Cell from './Cell';
import { useTablePageContext } from '../TablePage.context';

export default observer(function Row({
  fields,
  rowIndex,
}: {
  fields: FieldInfo[];
  rowIndex: number;
}) {
  const {
    tableService,
    tableDataService,
    dataChangesService,
    selectionService,
  } = useTablePageContext();
  const defaults = tableDataService.getDefaults();

  if (!defaults) return null;

  const isRemoved = dataChangesService.isRowRemoved(rowIndex);
  const isChanged = dataChangesService.isRowChanged(rowIndex);
  const isNew = dataChangesService.isNewRow(rowIndex);
  const isSelected = selectionService.isRowSelected(rowIndex);

  const rowNumber = rowIndex + 1;

  return (
    <tr>
      <td
        {...tableService.getRowProps(rowIndex)}
        tabIndex={-1}
        className={cn(
          'h-10 border-b border-l border-dark-4 sticky -left-px w-px',
          isNew
            ? 'bg-green-1'
            : isRemoved
            ? 'bg-darker-5'
            : isChanged
            ? 'bg-yellow-2'
            : 'bg-dark-3',
        )}
      >
        <div
          className={cn(
            'w-full h-full max-w-sm truncate flex items-center px-3 pointer-events-none',
            isSelected && 'bg-lighter-4',
          )}
        >
          {rowNumber}
        </div>
      </td>
      {fields.map((field, i) => (
        <Cell
          key={i}
          rowIndex={rowIndex}
          columnIndex={i}
          defaultValue={defaults[i]}
          isRemoved={isRemoved}
          isRowChanged={isChanged}
          isNew={isNew}
        />
      ))}
    </tr>
  );
});
