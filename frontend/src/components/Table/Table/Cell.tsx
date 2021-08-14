import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { CellType } from './Table.types';
import { useTablePageContext } from '../TablePage.context';

export default observer(function Row({
  rowIndex,
  columnIndex,
  isRemoved,
  isRowChanged,
  isNew,
  defaultValue,
}: {
  rowIndex: number;
  columnIndex: number;
  isRemoved: boolean;
  isRowChanged: boolean;
  isNew: boolean;
  defaultValue?: string;
}) {
  const { dataChangesService, selectionService } = useTablePageContext();

  const value = dataChangesService.getValue(rowIndex, columnIndex);
  const isRaw = dataChangesService.getIsRaw(rowIndex, columnIndex);

  const isChanged =
    isRowChanged && dataChangesService.isValueChanged(rowIndex, columnIndex);

  const isSelected = selectionService.isCellSelected(rowIndex, columnIndex);

  return (
    <td
      data-type={CellType.value}
      {...selectionService.getCellProps(rowIndex, columnIndex)}
      data-bg-class="bg-dark-4"
      data-row-index={rowIndex}
      data-column-index={columnIndex}
      tabIndex={0}
      className={cn(
        'h-10 border-b border-l',
        isSelected ? 'border-dark-5' : 'border-dark-4',
        !value && 'text-light-9',
        isNew
          ? 'bg-green-2'
          : isRemoved
          ? 'bg-darker-10'
          : isChanged
          ? 'bg-yellow-3'
          : undefined,
      )}
    >
      <div
        className={cn(
          'min-w-full min-h-full flex items-center max-w-sm truncate px-4 pointer-events-none',
          isSelected && 'bg-lighter-4',
        )}
      >
        {value === null || (value === '' && isRaw)
          ? defaultValue || 'null'
          : value?.length === 0
          ? 'empty'
          : value}
      </div>
    </td>
  );
});
