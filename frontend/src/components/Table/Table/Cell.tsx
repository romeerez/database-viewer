import React from 'react';
import cn from 'classnames';
import { useTablePageContext } from '../TablePage.context';

export default function Row({
  rowIndex,
  columnIndex,
  isRemoved,
  isNew,
  defaultValue,
}: {
  rowIndex: number;
  columnIndex: number;
  isRemoved: boolean;
  isNew: boolean;
  defaultValue?: string;
}) {
  const { tableService, dataChangesService, selectionService } =
    useTablePageContext();

  const value = dataChangesService.useValue(rowIndex, columnIndex);
  const isRaw = dataChangesService.useIsRaw(rowIndex, columnIndex);

  const isChanged = dataChangesService.useIsValueChanged(rowIndex, columnIndex);

  const isFocused = selectionService.useIsFocusedDataCell(
    rowIndex,
    columnIndex,
  );
  const isSelected = selectionService.useIsCellSelected(rowIndex, columnIndex);

  return (
    <td
      {...tableService.getCellProps(rowIndex, columnIndex)}
      data-bg-class="bg-dark-4"
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
          'min-w-full min-h-full flex items-center max-w-sm truncate px-4 pointer-events-none relative rounded-sm',
          isFocused && 'ring z-10',
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
}
