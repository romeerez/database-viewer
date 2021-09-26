const formatBoolean = (value: string) => {
  return value === 'true' ? `✔ true` : `✕ false`;
};

export const isNumberType = (type: string) =>
  type === 'int2' ||
  type === 'int4' ||
  type === 'int8' ||
  type === 'float4' ||
  type === 'float8' ||
  type === 'numeric';

export const isInteger = (type: string) =>
  isNumberType(type) && type !== 'int2' && type !== 'int4' && type !== 'int8';

export const isDateTime = (type: string) =>
  type === 'timestamp' ||
  type === 'timestamptz' ||
  type === 'date' ||
  type === 'time' ||
  type === 'timetz';

export const isTimestamp = (type: string) =>
  type === 'timestamp' || type === 'timestamptz';

export const isDate = (type: string) => type === 'date';

export const isTime = (type: string) => type === 'time' || type === 'timetz';

export const columnTypeFormatters: Record<
  string,
  ((value: string) => string) | undefined
> = {
  bool: formatBoolean,
};
