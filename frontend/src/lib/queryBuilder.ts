import { quote } from './quote';

export const buildQuery = ({
  schemaName,
  tableName,
  where,
  orderBy,
  limit,
  offset,
  count = false,
}: {
  schemaName: string;
  tableName: string;
  where?: string;
  orderBy?: string;
  limit?: number;
  offset?: number;
  count?: boolean;
}) => {
  let sql = count ? 'SELECT count(*) FROM ' : 'SELECT * FROM ';

  sql += schemaName === 'public' ? tableName : `${schemaName}.${tableName}`;

  if (where) sql += ` WHERE ${where}`;
  if (orderBy) sql += ` ORDER BY ${orderBy}`;

  if (!count) {
    if (limit) sql += ` LIMIT ${limit}`;
    if (offset) sql += ` OFFSET ${offset}`;
  }

  return sql;
};

export const buildTransaction = ({
  schemaName,
  tableName,
  primaryColumns,
  fields,
  defaults,
  removedRows,
  rowChanges,
  newRows,
}: {
  schemaName: string;
  tableName: string;
  primaryColumns: { name: string; index: number }[];
  fields: { name: string }[];
  defaults: (string | undefined)[];
  removedRows: (string | null)[][];
  rowChanges: {
    row: (string | null)[];
    changes: {
      columnName: string;
      columnIndex: number;
      isRaw: boolean;
      value: string | null;
    }[];
  }[];
  newRows: { value: string | null; isRaw: boolean }[][];
}) => {
  const result = ['BEGIN TRANSACTION;'];

  const table = `"${schemaName}"."${tableName}"`;

  if (primaryColumns) {
    removedRows.forEach((row) =>
      result.push(
        `DELETE FROM ${table} WHERE ${getWhere(primaryColumns, row)};`,
      ),
    );

    rowChanges.forEach(({ row, changes }) =>
      result.push(
        `UPDATE ${table}\nSET ${changes
          .map(
            ({ columnName, columnIndex, value, isRaw }) =>
              `"${columnName}" = ${valueToSql(
                isRaw,
                defaults,
                columnIndex,
                value,
              )}`,
          )
          .join(', ')}\nWHERE ${getWhere(primaryColumns, row)};`,
      ),
    );
  }

  if (fields) {
    newRows.forEach((row) =>
      result.push(
        `INSERT INTO ${table} (${fields
          .map((field) => field.name)
          .join(', ')})\nVALUES (${row
          .map(({ value, isRaw }, i) => valueToSql(isRaw, defaults, i, value))
          .join(', ')});`,
      ),
    );
  }

  result.push('COMMIT TRANSACTION;');

  return result.join('\n\n');
};

const valueToSql = (
  isRaw: boolean,
  defaults: (string | undefined)[],
  columnIndex: number,
  value: null | string,
) => {
  if (value === null) {
    return defaults[columnIndex] ? 'DEFAULT' : 'NULL';
  } else {
    return isRaw ? value : quote(value);
  }
};

const getWhere = (
  primaryColumns: { name: string; index: number }[],
  row: (string | null)[],
) =>
  primaryColumns
    .map(({ name, index }) => `"${name}" = ${row[index]}`)
    .join(' AND ');
