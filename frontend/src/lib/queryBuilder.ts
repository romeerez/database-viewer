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
  removedRows,
  rowChanges,
  newRows,
}: {
  schemaName: string;
  tableName: string;
  primaryColumns: { name: string; index: number }[];
  fields: { name: string }[];
  removedRows: (string | null)[][];
  rowChanges: {
    row: (string | null)[];
    changes: { columnName: { name: string }; value: string | null }[];
  }[];
  newRows: (string | null)[][];
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
        `UPDATE ${table} SET ${changes
          .map(
            ({ columnName, value }) => `"${columnName.name}" = ${quote(value)}`,
          )
          .join(', ')} WHERE ${getWhere(primaryColumns, row)};`,
      ),
    );
  }

  if (fields) {
    newRows.forEach((row) =>
      result.push(
        `INSERT INTO "${tableName}" (${fields.map(
          (field) => field.name,
        )}) VALUES (${row.map((value) => quote(value))});`,
      ),
    );
  }

  result.push('COMMIT TRANSACTION;');

  return result.join('\n\n');
};

const getWhere = (
  primaryColumns: { name: string; index: number }[],
  row: (string | null)[],
) =>
  primaryColumns
    .map(({ name, index }) => `"${name}" = ${row[index]}`)
    .join(' AND ');
