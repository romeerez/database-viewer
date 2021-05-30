export const buildQuery = ({
  schemaName,
  tableName,
  where,
  orderBy,
  limit,
  offset,
}: {
  schemaName: string;
  tableName: string;
  where?: string;
  orderBy?: string;
  limit?: number;
  offset?: number;
}) => {
  let sql = 'SELECT * FROM ';

  sql += schemaName === 'public' ? tableName : `${schemaName}.${tableName}`;

  if (where) sql += ` WHERE ${where}`;
  if (orderBy) sql += ` ORDER BY ${orderBy}`;
  if (limit) sql += ` LIMIT ${limit}`;
  if (offset) sql += ` OFFSET ${offset}`;

  return sql;
};
