import dayjs from 'dayjs';
import React, { ReactNode } from 'react';
import cn from 'classnames';

const formatNumber = (value: string) => value;

const formatTimestamp = (value: string) => {
  return dayjs.utc(parseInt(value)).format('YYYY-MM-DD HH:mm:ss.SSS');
};

const formatDate = (value: string) => {
  return dayjs.utc(parseInt(value)).format('YYYY-MM-DD');
};

const formatTime = (value: string) => {
  return dayjs.utc(parseInt(value)).format('HH:mm:ss.SSS');
};

const formatBoolean = (value: string) => {
  return value === 'true' ? `✔ true` : `✕ false`;
};

const formatters: Record<string, ((value: string) => ReactNode) | undefined> = {
  int2: formatNumber,
  int4: formatNumber,
  int8: formatNumber,
  float4: formatNumber,
  float8: formatNumber,
  numeric: formatNumber,
  timestamp: formatTimestamp,
  timestamptz: formatTimestamp,
  date: formatDate,
  time: formatTime,
  timetz: formatTime,
  bool: formatBoolean,
};

export const formatValue = (
  type: string,
  value: string | null,
  isFocused: boolean,
  isSelected: boolean,
  isRaw: boolean,
  defaultValue?: string,
) => {
  const formatter = formatters[type];
  return (
    <div
      className={cn(
        'min-w-full min-h-full flex items-center max-w-sm truncate px-4 pointer-events-none relative rounded-sm',
        isFocused && 'ring z-10',
        isSelected && 'bg-lighter-4',
        formatter === formatNumber && 'justify-end',
      )}
    >
      {value === null || (isRaw && value.length === 0)
        ? defaultValue || 'null'
        : value.length === 0
        ? 'empty'
        : formatter
        ? formatter(value)
        : value.replaceAll('\n', '↵')}
    </div>
  );
};
