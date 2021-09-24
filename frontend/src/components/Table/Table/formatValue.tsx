import React from 'react';
import cn from 'classnames';
import { columnTypeFormatters, isNumberType } from '../columnType.utils';

export const formatValue = (
  type: string,
  value: string | null,
  isFocused: boolean,
  isSelected: boolean,
  isRaw: boolean,
  defaultValue?: string,
) => {
  const formatter = columnTypeFormatters[type];
  return (
    <div
      className={cn(
        'min-w-full min-h-full flex items-center max-w-sm truncate px-4 pointer-events-none relative rounded-sm',
        isFocused && 'ring z-10',
        isSelected && 'bg-lighter-4',
        isNumberType(type) && 'justify-end',
      )}
    >
      {value === null || (isRaw && value.length === 0)
        ? defaultValue || 'null'
        : value.length === 0
        ? 'empty'
        : !isRaw && formatter
        ? formatter(value)
        : value.replaceAll('\n', '↵')}
    </div>
  );
};
