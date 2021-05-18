export const buildQuery = ({
  schemaName,
  tableName,
  limit,
  offset,
}: {
  schemaName: string;
  tableName: string;
  limit?: number;
  offset?: number;
}) => {
  let sql = 'SELECT * FROM ';

  sql += schemaName === 'public' ? tableName : `${schemaName}.${tableName}`;

  if (limit) sql += ` LIMIT ${limit}`;
  if (offset) sql += ` OFFSET ${offset}`;

  return sql;
};
