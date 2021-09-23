import dayjs from 'dayjs';
import { ReactNode } from 'react';

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

export const isNumberType = (type: string) =>
  columnTypeFormatters[type] === formatNumber;

export const isInteger = (type: string) =>
  isNumberType(type) && type !== 'int2' && type !== 'int4' && type !== 'int8';

export const columnTypeFormatters: Record<
  string,
  ((value: string) => ReactNode) | undefined
> = {
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
