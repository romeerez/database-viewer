import React from 'react';
import cn from 'classnames';
import { useTablePageContext } from '../TablePage.context';
import { formatValue } from './formatValue';

export default function Cell({
  rowIndex,
  columnIndex,
  isRemoved,
  isNew,
  defaultValue,
  type,
}: {
  rowIndex: number;
  columnIndex: number;
  isRemoved: boolean;
  isNew: boolean;
  defaultValue?: string;
  type: string;
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
      {formatValue(type, value, isFocused, isSelected, isRaw, defaultValue)}
    </td>
  );
}
